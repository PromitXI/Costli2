import { GoogleGenAI, Type, Schema } from "@google/genai";
import { InsightTile, InsightType, CloudProvider, InsightStep } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const INSIGHTS_MODEL = 'gemini-3-pro-preview';
const CHAT_MODEL = 'gemini-3-flash-preview';

// --- DEFAULTS (The Safety Net) ---
const getDefaults = (provider: CloudProvider): InsightTile[] => {
  const commonDetail = {
    steps: [{ title: "Review Usage", description: "Check current metrics." }],
    technicalDetails: "General recommendation based on best practices."
  };

  switch (provider) {
    case 'AWS':
      return [
        { id: 'aws-1', title: 'Compute', headline: 'Rightsize EC2 Instances', rationale: '20-30% of instances are typically over-provisioned.', type: InsightType.OPTIMIZATION, detail: commonDetail },
        { id: 'aws-2', title: 'Storage', headline: 'Enable S3 Intelligent-Tiering', rationale: 'Automatically move rarely accessed data to cheaper tiers.', type: InsightType.OPTIMIZATION, detail: commonDetail },
        { id: 'aws-3', title: 'Database', headline: 'Pause Idle RDS Instances', rationale: 'Dev/Test databases often run 24/7 unnecessarily.', type: InsightType.OPTIMIZATION, detail: commonDetail },
        { id: 'aws-4', title: 'Savings', headline: 'Purchase Compute Savings Plans', rationale: 'Commit to consistent usage for up to 66% discount.', type: InsightType.PRICING, detail: commonDetail },
        { id: 'aws-5', title: 'Networking', headline: 'Use CloudFront for Egress', rationale: 'Data transfer out via CDN is cheaper than direct EC2 egress.', type: InsightType.GUIDE, detail: commonDetail },
      ];
    case 'Azure':
      return [
        { id: 'az-1', title: 'Compute', headline: 'Use Azure Hybrid Benefit', rationale: 'Reuse on-premise Windows/SQL licenses to save up to 40%.', type: InsightType.PRICING, detail: commonDetail },
        { id: 'az-2', title: 'Storage', headline: 'Delete Unattached Managed Disks', rationale: 'Disks persist and charge even after VMs are deleted.', type: InsightType.WARNING, detail: commonDetail },
        { id: 'az-3', title: 'Database', headline: 'Switch to Azure SQL Serverless', rationale: 'Auto-pause compute during inactive periods.', type: InsightType.OPTIMIZATION, detail: commonDetail },
        { id: 'az-4', title: 'Spot', headline: 'Deploy Spot VMs for Batch Jobs', rationale: 'Use unused capacity for up to 90% savings.', type: InsightType.OPTIMIZATION, detail: commonDetail },
        { id: 'az-5', title: 'Governance', headline: 'Apply Management Groups', rationale: 'Enforce tagging and budget policies hierarchically.', type: InsightType.GUIDE, detail: commonDetail },
      ];
    case 'GCP':
      return [
        { id: 'gcp-1', title: 'Compute', headline: 'Stop Idle VM Instances', rationale: 'GCP can recommend stopping instances with low utilization.', type: InsightType.OPTIMIZATION, detail: commonDetail },
        { id: 'gcp-2', title: 'Discounts', headline: 'Leverage Sustained Use Discounts', rationale: 'Automatic discounts for running instances significantly.', type: InsightType.PRICING, detail: commonDetail },
        { id: 'gcp-3', title: 'Storage', headline: 'Set Object Lifecycle Policies', rationale: 'Transition Coldline/Archive storage automatically.', type: InsightType.OPTIMIZATION, detail: commonDetail },
        { id: 'gcp-4', title: 'Kubernetes', headline: 'Enable GKE Autopilot', rationale: 'Pay only for the pods you run, not the nodes.', type: InsightType.OPTIMIZATION, detail: commonDetail },
        { id: 'gcp-5', title: 'BigQuery', headline: 'Use Slot Reservations', rationale: 'Switch from on-demand to flat-rate for predictable high-volume workloads.', type: InsightType.PRICING, detail: commonDetail },
      ];
    default: return [];
  }
};

const insightSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING },
      title: { type: Type.STRING },
      headline: { type: Type.STRING },
      rationale: { type: Type.STRING },
      type: { type: Type.STRING, enum: [InsightType.OPTIMIZATION, InsightType.PRICING, InsightType.GUIDE, InsightType.WARNING] },
      detail: {
        type: Type.OBJECT,
        properties: {
          steps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING }
              }
            }
          },
          pricingTable: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                costEstimate: { type: Type.STRING },
                features: { type: Type.ARRAY, items: { type: Type.STRING } },
                justification: { type: Type.STRING }
              }
            }
          },
          technicalDetails: { type: Type.STRING }
        }
      }
    },
    required: ["id", "title", "headline", "rationale", "type", "detail"]
  }
};

const actionPlanSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      description: { type: Type.STRING }
    },
    required: ["title", "description"]
  }
};

const cleanJson = (text: string) => {
  if (!text) return "[]";
  const match = text.match(/```json([\s\S]*?)```/);
  if (match) return match[1].trim();
  const matchNoLang = text.match(/```([\s\S]*?)```/);
  if (matchNoLang) return matchNoLang[1].trim();
  const firstBracket = text.indexOf('[');
  const lastBracket = text.lastIndexOf(']');
  if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
      return text.substring(firstBracket, lastBracket + 1);
  }
  return text.trim();
};

/**
 * Sanitize user prompt: preserve meaning while escaping only truly dangerous chars.
 * Truncate to a safe length to avoid exceeding model context limits.
 */
const sanitizePrompt = (text: string, maxLength: number = 2000): string => {
  let safe = text
    .replace(/\\/g, '\\\\')  // escape backslashes
    .replace(/\t/g, ' ')      // tabs to spaces
    .replace(/\r\n/g, '\n')   // normalize line endings
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n') // collapse excessive newlines
    .trim();

  if (safe.length > maxLength) {
    // Truncate at last sentence boundary before maxLength
    const truncated = safe.substring(0, maxLength);
    const lastPeriod = truncated.lastIndexOf('.');
    safe = lastPeriod > maxLength * 0.5 
      ? truncated.substring(0, lastPeriod + 1) 
      : truncated + '...';
  }
  return safe;
};

/**
 * Create a short summary of a prompt for display purposes.
 */
const summarizePrompt = (text: string, maxLength: number = 120): string => {
  if (text.length <= maxLength) return text;
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > maxLength * 0.5 ? truncated.substring(0, lastSpace) : truncated) + '...';
};

export const analyzeCostScenario = async (prompt: string, provider: CloudProvider): Promise<InsightTile[]> => {
  try {
    const systemInstruction = `
You are Costli's Insight Engine — a senior cloud cost optimization advisor specialized in ${provider}.

YOUR ROLE:
- Analyze the user's cloud scenario and produce SPECIFIC, ACTIONABLE cost optimization recommendations.
- Every recommendation MUST reference REAL ${provider} services, features, and pricing models.
- Include concrete estimated savings percentages or dollar ranges where possible.
- Tailor recommendations to the user's specific workload, not generic advice.

OUTPUT RULES:
1. Generate exactly 5 Insight Tiles as a JSON array.
2. If the user query mentions a specific service (e.g., "EC2", "VMs", "BigQuery"), focus ALL 5 tiles on that service and related cost drivers.
3. If the user query is general (e.g., "reduce costs"), cover the TOP 5 highest-impact optimization areas for ${provider} with specific service names and savings estimates.
4. Each tile MUST have:
   - A specific, technical headline (e.g., "Switch to gp3 EBS Volumes" not "Optimize Storage")
   - A rationale with estimated savings (e.g., "gp3 volumes cost 20% less than gp2 for the same IOPS")
   - 2-4 actionable implementation steps in the detail.steps array
   - Relevant technicalDetails with CLI commands or console navigation paths
5. Use the correct insight type: OPTIMIZATION for resource rightsizing/elimination, PRICING for commitment/discount programs, GUIDE for architectural changes, WARNING for cost risks or anomalies.
6. NEVER return an empty array. NEVER use placeholder text.
7. Keep JSON valid and concise. Prioritize accuracy over length.

PRICING KNOWLEDGE (use current ${provider} pricing):
- Reference actual instance types, storage classes, and pricing tiers.
- Compare on-demand vs reserved/committed pricing accurately.
- Include region-specific considerations when relevant.
    `;

    const response = await ai.models.generateContent({
      model: INSIGHTS_MODEL,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: insightSchema,
        maxOutputTokens: 8192,
        temperature: 0.3,
      }
    });

    if (response.text) {
      try {
        const cleanedText = cleanJson(response.text);
        const parsed = JSON.parse(cleanedText);
        
        // If API returns empty or invalid array, fallback immediately
        if (!Array.isArray(parsed) || parsed.length === 0) {
            console.warn("AI returned empty/invalid array. Using defaults.");
            return getDefaults(provider);
        }
        return parsed;
      } catch (e) {
        console.error("JSON Parse Error (using defaults):", e);
        return getDefaults(provider);
      }
    }
    
    // Text was undefined
    return getDefaults(provider);

  } catch (error) {
    console.error("Gemini API Error (using defaults):", error);
    // CRITICAL: On ANY error, return defaults. Never show an empty screen.
    return getDefaults(provider);
  }
};

export const generateActionPlan = async (headline: string, rationale: string, provider: CloudProvider): Promise<InsightStep[]> => {
  try {
    const systemInstruction = `
You are a senior ${provider} Cloud Architect creating a step-by-step implementation plan.
Provide 4-6 clear, actionable steps. Each step must include:
- A concise title (what to do)
- A detailed description with specific ${provider} console paths, CLI commands, or API calls
- Include prerequisite checks, rollback considerations, and validation steps
Be technically precise. Reference real ${provider} service names, features, and tools.
    `;

    const userContent = `
Create a detailed implementation plan for: "${headline}"

Context: ${rationale}

Cloud Provider: ${provider}

Include specific CLI commands or console navigation steps where applicable.
    `;

    const response = await ai.models.generateContent({
      model: INSIGHTS_MODEL,
      contents: userContent,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: actionPlanSchema,
        maxOutputTokens: 8192,
        temperature: 0.3
      }
    });

    if (response.text) {
      const cleanedText = cleanJson(response.text);
      const parsed = JSON.parse(cleanedText);
      return Array.isArray(parsed) ? parsed : [];
    }
    return [];
  } catch (error) {
    console.error("Action Plan Error:", error);
    return [{ title: "Manual Review", description: "Please review the official documentation for this service." }];
  }
};

export const createChatSession = (provider: CloudProvider) => {
  return ai.chats.create({
    model: CHAT_MODEL,
    config: {
      systemInstruction: `
You are 'Cost Compass', a senior cloud cost optimization consultant specialized in ${provider}.

YOUR EXPERTISE:
- Deep knowledge of ${provider} pricing models, discount programs, and cost optimization tools.
- Ability to recommend specific instance types, storage classes, and architectural changes with real pricing.
- Understanding of reserved instances, savings plans, committed use discounts, and spot/preemptible pricing.

BEHAVIOR:
- Always reference SPECIFIC ${provider} service names, not generic terms.
- When discussing costs, include estimated savings percentages or dollar ranges.
- Ask clarifying questions about workload patterns, regions, and current spend to give better advice.
- Recommend ${provider}-native cost management tools (e.g., AWS Cost Explorer, Azure Cost Management, GCP Billing Reports).
- Use Markdown formatting (**bold**, lists, \`code\`) for readability.
- Be concise but technically precise. Avoid vague advice like "optimize your resources".
      `
    }
  });
};