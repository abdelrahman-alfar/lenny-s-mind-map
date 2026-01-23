import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Topic keywords for matching
const topicKeywords: Record<string, string[]> = {
  'product-strategy': ['strategy', 'vision', 'roadmap', 'okr', 'planning', 'prioritization', 'mission', 'goals'],
  'growth': ['growth', 'acquisition', 'retention', 'viral', 'referral', 'activation', 'onboarding', 'conversion', 'funnel'],
  'metrics': ['metrics', 'kpi', 'analytics', 'data', 'measurement', 'north star', 'cohort', 'dashboard'],
  'user-research': ['research', 'user interview', 'customer', 'feedback', 'usability', 'testing', 'discovery', 'insight'],
  'product-market-fit': ['product market fit', 'pmf', 'market', 'validation', 'pivot', 'iteration'],
  'team-building': ['team', 'hiring', 'culture', 'organization', 'structure', 'management', 'leadership', 'people'],
  'execution': ['execution', 'shipping', 'agile', 'sprint', 'launch', 'release', 'velocity', 'process'],
  'pricing': ['pricing', 'monetization', 'revenue', 'business model', 'subscription', 'freemium'],
  'b2b': ['b2b', 'enterprise', 'sales', 'sales-led', 'account', 'contract'],
  'consumer': ['consumer', 'b2c', 'marketplace', 'social', 'mobile', 'app'],
  'ai-ml': ['ai', 'machine learning', 'artificial intelligence', 'llm', 'gpt', 'automation'],
  'design': ['design', 'ux', 'ui', 'user experience', 'interface', 'prototype', 'figma'],
  'career': ['career', 'job', 'interview', 'promotion', 'resume', 'networking', 'mentor'],
  'communication': ['communication', 'stakeholder', 'presentation', 'writing', 'storytelling', 'influence'],
  'prioritization': ['prioritization', 'backlog', 'trade-off', 'decision', 'framework', 'rice', 'ice'],
  'experimentation': ['experiment', 'a/b test', 'hypothesis', 'testing', 'validation', 'data-driven'],
  'platform': ['platform', 'api', 'ecosystem', 'developer', 'integration', 'marketplace'],
  'startup': ['startup', 'founder', 'venture', 'fundraising', 'investor', 'seed', 'series'],
};

function matchTopics(text: string): { topicIds: string[]; scores: Record<string, number> } {
  const lowerText = text.toLowerCase();
  const scores: Record<string, number> = {};
  
  for (const [topicId, keywords] of Object.entries(topicKeywords)) {
    let score = 0;
    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      const matches = lowerText.match(regex);
      if (matches) {
        score += matches.length;
      }
    }
    if (score > 0) {
      scores[topicId] = score;
    }
  }
  
  const topicIds = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id]) => id);
  
  return { topicIds, scores };
}

function parseEpisodeInfo(filename: string, content: string): {
  title: string;
  episodeNumber: number | null;
} {
  const episodeMatch = filename.match(/^(\d+)/);
  const episodeNumber = episodeMatch ? parseInt(episodeMatch[1], 10) : null;
  
  const titleMatch = content.match(/^#\s*(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : filename.replace(/\.md$/, '').replace(/_/g, ' ');
  
  return { title, episodeNumber };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Create sync log entry
  const { data: syncLog, error: logError } = await supabase
    .from('sync_logs')
    .insert({ sync_type: 'github_episodes', status: 'running' })
    .select()
    .single();

  if (logError) {
    console.error('Failed to create sync log:', logError);
  }

  const syncLogId = syncLog?.id;

  try {
    console.log('Starting GitHub sync...');
    
    // Use GitHub Tree API to get all files in one call (much faster than Contents API)
    const treeApiUrl = 'https://api.github.com/repos/ChatPRD/lennys-podcast-transcripts/git/trees/main?recursive=1';
    console.log('Fetching tree from:', treeApiUrl);
    
    const response = await fetch(treeApiUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Lovable-Knowledge-Map',
      },
    });

    console.log('GitHub API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('GitHub API error response:', errorText);
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const treeData = await response.json();
    console.log('Tree truncated:', treeData.truncated);
    
    // Filter for markdown files in the episodes folder
    const episodeFiles = treeData.tree.filter((item: any) => 
      item.type === 'blob' && 
      item.path.startsWith('episodes/') && 
      item.path.endsWith('.md')
    );
    
    console.log(`Found ${episodeFiles.length} episode transcript files`);

    // Get existing episodes
    const { data: existingEpisodes } = await supabase
      .from('synced_episodes')
      .select('github_filename');
    
    const existingFilenames = new Set(existingEpisodes?.map(e => e.github_filename) || []);
    
    let added = 0;
    let updated = 0;
    
    // Process files - limit to 50 per sync to avoid timeout
    const filesToProcess = episodeFiles.slice(0, 50);
    console.log(`Processing ${filesToProcess.length} files this batch`);

    for (const file of filesToProcess) {
      try {
        // Extract guest name from path (e.g., "episodes/adam-fishman/transcript.md")
        const pathParts = file.path.split('/');
        const guestDir = pathParts[1] || '';
        const guestName = guestDir.replace(/-/g, ' ');
        
        // Fetch file content via raw URL
        const rawUrl = `https://raw.githubusercontent.com/ChatPRD/lennys-podcast-transcripts/main/${file.path}`;
        const contentResponse = await fetch(rawUrl);
        
        if (!contentResponse.ok) {
          console.error(`Failed to fetch ${file.path}: ${contentResponse.status}`);
          continue;
        }
        
        const content = await contentResponse.text();
        
        // Parse episode info
        const { title, episodeNumber } = parseEpisodeInfo(file.path, content);
        
        // Get transcript preview (first 500 chars, cleaned)
        const preview = content.slice(0, 500).replace(/[#*_`]/g, '').trim();
        
        // Match topics based on content
        const { topicIds, scores } = matchTopics(content);
        
        // Use guest directory as unique identifier
        const filename = guestDir || file.path;
        
        const episodeData = {
          github_filename: filename,
          episode_title: title || guestName,
          episode_number: episodeNumber,
          guest_name: guestName,
          transcript_preview: preview,
          matched_topic_ids: topicIds,
          match_scores: scores,
          github_url: `https://github.com/ChatPRD/lennys-podcast-transcripts/blob/main/${file.path}`,
          synced_at: new Date().toISOString(),
        };

        if (existingFilenames.has(filename)) {
          const { error } = await supabase
            .from('synced_episodes')
            .update(episodeData)
            .eq('github_filename', filename);
          
          if (!error) updated++;
        } else {
          const { error } = await supabase
            .from('synced_episodes')
            .insert(episodeData);
          
          if (!error) added++;
          else console.error(`Insert error for ${filename}:`, error);
        }
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 50));
        
      } catch (fileError) {
        console.error(`Error processing ${file.path}:`, fileError);
      }
    }

    console.log(`Sync complete: ${added} added, ${updated} updated`);

    // Update sync log
    if (syncLogId) {
      await supabase
        .from('sync_logs')
        .update({
          episodes_found: episodeFiles.length,
          episodes_added: added,
          episodes_updated: updated,
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', syncLogId);
    }

    return new Response(
      JSON.stringify({
        success: true,
        episodesFound: episodeFiles.length,
        added,
        updated,
        remaining: Math.max(0, episodeFiles.length - 50),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Sync error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    if (syncLogId) {
      await supabase
        .from('sync_logs')
        .update({
          status: 'failed',
          error_message: errorMessage,
          completed_at: new Date().toISOString(),
        })
        .eq('id', syncLogId);
    }

    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
