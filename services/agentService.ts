/**
 * ═══════════════════════════════════════════════════════════════
 *  COSTLI MULTI-AGENT SERVICE
 *  Architecture: Orchestrator → 3 Research Agents → Synthesizer
 *  Each agent uses Tavily Search for real-time web research
 * ═══════════════════════════════════════════════════════════════
 */

import { InsightTile, InsightType, InsightStep, CloudProvider } from '../types';

// ── Config ──────────────────────────────────────────────────────
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const TAVILY_API_KEY = process.env.TAVILY_API_KEY || '';
const OPENAI_MODEL = 'gpt-4o';
const OPENAI_MINI = 'gpt-4o-mini';

function getFallbackInsights(provider: CloudProvider): InsightTile[] {
  const commonDetail = {
    steps: [
      { title: 'Baseline spend', description: `Open ${provider} cost tooling and identify top services by spend over the last 30 days.` },
      { title: 'Apply one low-risk optimization', description: 'Start with a single high-impact change and validate results before broader rollout.' },
      { title: 'Track realized savings', description: 'Compare post-change spend and usage metrics to confirm measurable cost reduction.' },
    ],
    technicalDetails: 'Fallback insights shown because live agent analysis failed. Check API keys and network access for OpenAI and Tavily.',
  };

  return [
    {
      id: `${provider.toLowerCase()}-fallback-1`,
      title: 'Compute',
      headline: `Rightsize overprovisioned ${provider} compute`,
      rationale: 'Overprovisioned compute is a common cost driver and typically offers immediate optimization opportunity.',
      type: InsightType.OPTIMIZATION,
      detail: commonDetail,
    },
    {
      id: `${provider.toLowerCase()}-fallback-2`,
      title: 'Pricing',
      headline: `Use commitment discounts for steady ${provider} workloads`,
      rationale: 'Commitment-based pricing can materially reduce effective unit costs versus on-demand usage.',
      type: InsightType.PRICING,
      detail: commonDetail,
    },
    {
      id: `${provider.toLowerCase()}-fallback-3`,
      title: 'Storage',
      headline: `Move infrequently accessed data to cheaper ${provider} tiers`,
      rationale: 'Lifecycle policies and colder storage tiers reduce recurring storage spend without architecture changes.',
      type: InsightType.OPTIMIZATION,
      detail: commonDetail,
    },
    {
      id: `${provider.toLowerCase()}-fallback-4`,
      title: 'Governance',
      headline: `Enable budget alerts and anomaly detection`,
      rationale: 'Continuous spend monitoring detects regressions early and prevents surprise cost spikes.',
      type: InsightType.GUIDE,
      detail: commonDetail,
    },
    {
      id: `${provider.toLowerCase()}-fallback-5`,
      title: 'Risk',
      headline: `Audit idle resources and unattached assets`,
      rationale: 'Unused resources and orphaned storage regularly create hidden spend with no production value.',
      type: InsightType.WARNING,
      detail: commonDetail,
    },
  ];
}

// ── Types ───────────────────────────────────────────────────────

interface ResearchTask {
  agentRole: string;
  taskDescription: string;
  searchQueries: string[];
}

interface AgentResult {
  agentRole: string;
  findings: string;
  sources: string[];
}

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  tool_call_id?: string;
  tool_calls?: any[];
}

// ── Tavily Search Tool ──────────────────────────────────────────

async function tavilySearch(query: string, maxResults: number = 5): Promise<{ results: { title: string; url: string; content: string }[] }> {
  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: TAVILY_API_KEY,
        query: query,
        max_results: maxResults,
        search_depth: 'advanced',
        include_answer: true,
        include_raw_content: false,
      }),
    });

    if (!response.ok) {
      console.error(`Tavily search failed: ${response.status}`);
      return { results: [] };
    }

    const data = await response.json();
    return {
      results: (data.results || []).map((r: any) => ({
        title: r.title || '',
        url: r.url || '',
        content: (r.content || '').substring(0, 800),
      })),
    };
  } catch (error) {
    console.error('Tavily search error:', error);
    return { results: [] };
  }
}

// ── OpenAI Call Helper ──────────────────────────────────────────

async function callOpenAI(
  messages: OpenAIMessage[],
  model: string = OPENAI_MODEL,
  temperature: number = 0.3,
  maxTokens: number = 4096,
  tools?: any[],
  responseFormat?: any
): Promise<any> {
  const body: any = {
    model,
    messages,
    temperature,
    max_tokens: maxTokens,
  };
  if (tools && tools.length > 0) body.tools = tools;
  if (responseFormat) body.response_format = responseFormat;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${errorText}`);
  }

  return response.json();
}

// ── Tool Definitions ────────────────────────────────────────────

const searchTool = {
  type: 'function' as const,
  function: {
    name: 'web_search',
    description: 'Search the web for current cloud pricing, documentation, best practices, and cost optimization techniques. Use this to find real, up-to-date information.',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The search query. Be specific - include cloud provider name, service name, and what you are looking for (pricing, best practices, optimization, etc.)',
        },
      },
      required: ['query'],
    },
  },
};

// ── STEP 1: ORCHESTRATOR ────────────────────────────────────────

async function runOrchestrator(userPrompt: string, provider: CloudProvider): Promise<ResearchTask[]> {
  const systemPrompt = `You are the Costli Orchestrator — a senior cloud cost analyst.

Your job is to analyze the user's cloud cost concern and break it into EXACTLY 3 focused research tasks for specialized agents.

RULES:
1. Read the user's scenario carefully. Identify the SPECIFIC services, workloads, and concerns mentioned.
2. Create 3 tasks — each covering a DIFFERENT angle of the problem:
   - Task 1 (Pricing Analyst): Research current ${provider} pricing, tiers, and hidden cost drivers for the mentioned services.
   - Task 2 (Optimization Specialist): Research specific optimization techniques, configuration changes, and best practices for the mentioned services.  
   - Task 3 (Architecture Advisor): Research alternative architectures, service substitutions, or design patterns that could reduce costs.
3. Each task must include 2-3 specific Google search queries that would find real, actionable information.
4. Tasks must be SPECIFIC to the user's scenario — NOT generic cloud advice.

Respond with ONLY valid JSON matching this structure:
{
  "tasks": [
    {
      "agentRole": "Pricing Analyst",
      "taskDescription": "Research the exact pricing tiers for...", 
      "searchQueries": ["azure storage account cool tier pricing 2025", "..."]
    }
  ]
}`;

  try {
    const result = await callOpenAI(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Cloud Provider: ${provider}\n\nUser's Scenario:\n${userPrompt}` },
      ],
      OPENAI_MODEL,
      0.2,
      2048,
      undefined,
      { type: 'json_object' }
    );

    const content = result.choices?.[0]?.message?.content;
    if (!content) throw new Error('No orchestrator response');
    
    const parsed = JSON.parse(content);
    return parsed.tasks || [];
  } catch (error) {
    console.error('Orchestrator error:', error);
    // Fallback: generate default research tasks
    return [
      {
        agentRole: 'Pricing Analyst',
        taskDescription: `Research current ${provider} pricing for the services mentioned by the user.`,
        searchQueries: [`${provider} pricing calculator 2025`, `${provider} cost optimization pricing tiers`],
      },
      {
        agentRole: 'Optimization Specialist',
        taskDescription: `Find specific optimization techniques for ${provider} services mentioned.`,
        searchQueries: [`${provider} cost optimization best practices 2025`, `reduce ${provider} cloud costs`],
      },
      {
        agentRole: 'Architecture Advisor',
        taskDescription: `Research alternative architectures that could reduce ${provider} costs.`,
        searchQueries: [`${provider} cost efficient architecture patterns`, `${provider} well-architected cost optimization`],
      },
    ];
  }
}

// ── STEP 2: RESEARCH AGENT (with Tavily search tool) ────────────

async function runResearchAgent(task: ResearchTask, provider: CloudProvider): Promise<AgentResult> {
  const systemPrompt = `You are a ${task.agentRole} — a specialized cloud cost research agent for ${provider}.

YOUR MISSION: ${task.taskDescription}

RULES:
1. Use the web_search tool to find REAL, CURRENT information. Do NOT hallucinate prices or features.
2. Search MULTIPLE times if needed — at least use the provided search queries.
3. After researching, write a DETAILED findings report that includes:
   - Specific prices, tiers, or rates you found (with sources)
   - Concrete optimization techniques with estimated savings
   - Step-by-step actions the user can take
   - Any warnings or caveats
4. Be specific and technical. Reference exact service names, SKUs, regions, and pricing tiers.
5. Your findings will be used by another agent to create actionable recommendations, so be thorough.`;

  const messages: OpenAIMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `Research task: ${task.taskDescription}\n\nSuggested search queries: ${task.searchQueries.join(', ')}` },
  ];

  const allSources: string[] = [];
  let maxIterations = 6; // Prevent infinite loops

  try {
    while (maxIterations > 0) {
      maxIterations--;

      const result = await callOpenAI(messages, OPENAI_MODEL, 0.2, 4096, [searchTool]);
      const choice = result.choices?.[0];

      if (!choice) break;

      // If the model wants to call tools
      if (choice.finish_reason === 'tool_calls' || choice.message?.tool_calls) {
        const toolCalls = choice.message.tool_calls || [];
        
        // Add assistant message with tool calls
        messages.push({
          role: 'assistant',
          content: choice.message.content || '',
          tool_calls: toolCalls,
        });

        // Execute each tool call
        for (const toolCall of toolCalls) {
          if (toolCall.function.name === 'web_search') {
            const args = JSON.parse(toolCall.function.arguments);
            console.log(`  🔍 [${task.agentRole}] Searching: "${args.query}"`);
            
            const searchResults = await tavilySearch(args.query, 5);
            
            // Collect sources
            searchResults.results.forEach(r => {
              if (r.url) allSources.push(r.url);
            });

            // Format search results for the agent
            const formattedResults = searchResults.results
              .map((r, i) => `[${i + 1}] ${r.title}\n    URL: ${r.url}\n    ${r.content}`)
              .join('\n\n');

            messages.push({
              role: 'tool',
              content: formattedResults || 'No results found for this query.',
              tool_call_id: toolCall.id,
            });
          }
        }
      } else {
        // Model is done — return findings
        return {
          agentRole: task.agentRole,
          findings: choice.message?.content || 'No findings generated.',
          sources: [...new Set(allSources)],
        };
      }
    }

    // If we exhausted iterations, get the final response
    const finalResult = await callOpenAI(messages, OPENAI_MODEL, 0.2, 4096);
    return {
      agentRole: task.agentRole,
      findings: finalResult.choices?.[0]?.message?.content || 'Research completed.',
      sources: [...new Set(allSources)],
    };
  } catch (error) {
    console.error(`Agent ${task.agentRole} error:`, error);
    return {
      agentRole: task.agentRole,
      findings: `Error during research: ${error instanceof Error ? error.message : 'Unknown error'}`,
      sources: [],
    };
  }
}

// ── STEP 3: SYNTHESIZER ─────────────────────────────────────────

async function synthesizeInsights(
  agentResults: AgentResult[],
  userPrompt: string,
  provider: CloudProvider
): Promise<InsightTile[]> {
  const combinedFindings = agentResults
    .map(r => `\n══ ${r.agentRole.toUpperCase()} FINDINGS ══\n${r.findings}\n\nSources: ${r.sources.slice(0, 3).join(', ') || 'No sources'}`)
    .join('\n\n');

  const systemPrompt = `You are the Costli Synthesizer. You take research findings from 3 specialized agents and produce the final cost optimization recommendations.

OUTPUT FORMAT: You MUST respond with a JSON array of exactly 5 InsightTile objects:
[
  {
    "id": "unique-id-1",
    "title": "Short Category (e.g. Storage, Compute)",
    "headline": "Specific Actionable Headline (e.g. 'Move Infrequently Accessed Blobs to Archive Tier')",
    "rationale": "Why this matters with REAL numbers from the research (e.g. 'Archive tier costs $0.00099/GB vs $0.01/GB for Cool tier — 90% savings on storage costs')",
    "type": "OPTIMIZATION|PRICING|GUIDE|WARNING",
    "detail": {
      "steps": [
        { "title": "Step Title", "description": "Detailed step with specific CLI commands or portal navigation" }
      ],
      "pricingTable": [
        { "name": "Tier Name", "costEstimate": "$X.XX/GB/month", "features": ["feature1"], "justification": "Why this tier" }
      ],
      "technicalDetails": "Technical context, commands, or caveats"
    }
  }
]

RULES:
1. Each insight MUST be grounded in the research findings — use real prices and facts found by the agents.
2. Headlines must be SPECIFIC and ACTIONABLE — not generic advice.
3. Rationale must include SPECIFIC numbers, percentages, or dollar amounts from the research.
4. Steps must reference real ${provider} tools, CLI commands (az/aws/gcloud), or portal paths.
5. Include a pricingTable for at least 2 tiles comparing current vs. recommended pricing.
6. Use types correctly: OPTIMIZATION for resource changes, PRICING for tier/commitment changes, GUIDE for architecture changes, WARNING for risk/waste detection.
7. EVERY tile must be directly relevant to the user's specific scenario.`;

  try {
    const result = await callOpenAI(
      [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `USER'S ORIGINAL SCENARIO:\n${userPrompt}\n\nCLOUD PROVIDER: ${provider}\n\nRESEARCH FINDINGS:\n${combinedFindings}\n\nSynthesize these findings into 5 specific InsightTile JSON objects. Use REAL data from the research.`,
        },
      ],
      OPENAI_MODEL,
      0.3,
      8192,
      undefined,
      { type: 'json_object' }
    );

    const content = result.choices?.[0]?.message?.content;
    if (!content) throw new Error('No synthesizer response');

    const parsed = JSON.parse(content);
    const tiles = parsed.tiles || parsed.insights || parsed;

    if (Array.isArray(tiles) && tiles.length > 0) {
      // Validate and normalize InsightType enum values
      return tiles.map((tile: any, idx: number) => ({
        ...tile,
        id: tile.id || `insight-${idx + 1}`,
        type: normalizeInsightType(tile.type),
      }));
    }

    throw new Error('Invalid synthesizer output');
  } catch (error) {
    console.error('Synthesizer error:', error);
    throw error;
  }
}

function normalizeInsightType(type: string): InsightType {
  const upper = (type || '').toUpperCase();
  if (upper.includes('OPTIM')) return InsightType.OPTIMIZATION;
  if (upper.includes('PRIC')) return InsightType.PRICING;
  if (upper.includes('GUID') || upper.includes('ARCH')) return InsightType.GUIDE;
  if (upper.includes('WARN') || upper.includes('RISK')) return InsightType.WARNING;
  return InsightType.OPTIMIZATION;
}

// ── PUBLIC API: Main Orchestration Pipeline ─────────────────────

export async function analyzeWithAgents(
  userPrompt: string,
  provider: CloudProvider,
  onProgress?: (stage: string) => void
): Promise<InsightTile[]> {
  try {
    if (!OPENAI_API_KEY) {
      console.warn('OPENAI_API_KEY missing. Using fallback insights.');
      onProgress?.('Using fallback insights...');
      return getFallbackInsights(provider);
    }

    // STAGE 1: Orchestrator breaks down the problem
    onProgress?.('Analyzing your scenario...');
    console.log('🎯 [Orchestrator] Breaking down user query...');
    const tasks = await runOrchestrator(userPrompt, provider);
    console.log(`🎯 [Orchestrator] Created ${tasks.length} research tasks`);

    // STAGE 2: Run all 3 research agents IN PARALLEL
    onProgress?.('Agents researching...');
    console.log('🚀 [Agents] Starting parallel research...');
    const agentResults = await Promise.all(
      tasks.map(task => {
        console.log(`  📋 [${task.agentRole}] Starting: ${task.taskDescription.substring(0, 80)}...`);
        return runResearchAgent(task, provider);
      })
    );
    console.log('✅ [Agents] All agents completed research');

    // STAGE 3: Synthesize findings into InsightTiles
    onProgress?.('Synthesizing recommendations...');
    console.log('🧪 [Synthesizer] Combining findings into insights...');
    const insights = await synthesizeInsights(agentResults, userPrompt, provider);
    console.log(`✅ [Synthesizer] Generated ${insights.length} insights`);

    return insights.length > 0 ? insights : getFallbackInsights(provider);
  } catch (error) {
    console.error('Agent pipeline error:', error);
    onProgress?.('Using fallback insights...');
    return getFallbackInsights(provider);
  }
}

// ── PUBLIC API: Action Plan Generation ──────────────────────────

export async function generateAgentActionPlan(
  headline: string,
  rationale: string,
  provider: CloudProvider
): Promise<InsightStep[]> {
  try {
    // Search for implementation specifics
    const searchResults = await tavilySearch(
      `${provider} how to ${headline} step by step implementation guide`,
      5
    );

    const searchContext = searchResults.results
      .map(r => `${r.title}: ${r.content}`)
      .join('\n\n');

    const result = await callOpenAI(
      [
        {
          role: 'system',
          content: `You are a senior ${provider} Cloud Architect. Create a detailed implementation plan.
          
Respond with ONLY a JSON object: { "steps": [ { "title": "...", "description": "..." } ] }

Each step MUST include:
- Specific ${provider} CLI commands (az/aws/gcloud) or portal navigation paths
- Prerequisites and validation checks
- Expected outcome and how to verify`,
        },
        {
          role: 'user',
          content: `Create implementation steps for: "${headline}"\n\nContext: ${rationale}\n\nResearch:\n${searchContext}`,
        },
      ],
      OPENAI_MODEL,
      0.2,
      4096,
      undefined,
      { type: 'json_object' }
    );

    const content = result.choices?.[0]?.message?.content;
    if (!content) return [];

    const parsed = JSON.parse(content);
    return parsed.steps || parsed || [];
  } catch (error) {
    console.error('Action plan error:', error);
    return [{ title: 'Manual Review', description: `Review ${provider} documentation for ${headline}.` }];
  }
}

// ── PUBLIC API: Chat Session ────────────────────────────────────

export class AgentChatSession {
  private messages: OpenAIMessage[];
  private provider: CloudProvider;

  constructor(provider: CloudProvider) {
    this.provider = provider;
    this.messages = [
      {
        role: 'system',
        content: `You are 'Cost Compass', a senior cloud cost optimization consultant for ${provider}.

YOUR EXPERTISE:
- Deep knowledge of ${provider} pricing models, discount programs, and cost tools.
- Specific instance types, storage classes, tiers, and architecture patterns with real pricing.
- Reserved instances, savings plans, committed use discounts, spot/preemptible pricing.

BEHAVIOR:
- ALWAYS reference SPECIFIC ${provider} service names and features — never generic advice.
- Include estimated savings percentages or dollar ranges when discussing costs.
- Ask clarifying questions to give better advice (workload patterns, regions, current spend).
- Use Markdown: **bold**, lists, \`code\` for CLI commands.
- Be concise, technically precise, and actionable.`,
      },
    ];
  }

  async sendMessage(userText: string): Promise<string> {
    // Add user message
    this.messages.push({ role: 'user', content: userText });

    // Keep history manageable (last 20 messages + system)
    if (this.messages.length > 21) {
      this.messages = [this.messages[0], ...this.messages.slice(-20)];
    }

    try {
      // Give the chat agent search capability too
      const result = await callOpenAI(
        this.messages,
        OPENAI_MINI,
        0.4,
        2048,
        [searchTool]
      );

      const choice = result.choices?.[0];
      
      // Handle tool calls (search)
      if (choice?.message?.tool_calls) {
        const toolCalls = choice.message.tool_calls;
        this.messages.push({
          role: 'assistant',
          content: choice.message.content || '',
          tool_calls: toolCalls,
        });

        for (const tc of toolCalls) {
          if (tc.function.name === 'web_search') {
            const args = JSON.parse(tc.function.arguments);
            const searchResults = await tavilySearch(args.query, 3);
            const formatted = searchResults.results
              .map((r, i) => `[${i + 1}] ${r.title}: ${r.content}`)
              .join('\n');
            this.messages.push({
              role: 'tool',
              content: formatted || 'No results found.',
              tool_call_id: tc.id,
            });
          }
        }

        // Get final response after tool use
        const finalResult = await callOpenAI(this.messages, OPENAI_MINI, 0.4, 2048);
        const responseText = finalResult.choices?.[0]?.message?.content || "I couldn't process that. Could you rephrase?";
        this.messages.push({ role: 'assistant', content: responseText });
        return responseText;
      }

      const responseText = choice?.message?.content || "I couldn't process that. Could you rephrase?";
      this.messages.push({ role: 'assistant', content: responseText });
      return responseText;
    } catch (error) {
      console.error('Chat error:', error);
      return "I'm having trouble connecting. Please try again.";
    }
  }
}

export function createAgentChatSession(provider: CloudProvider): AgentChatSession {
  return new AgentChatSession(provider);
}
