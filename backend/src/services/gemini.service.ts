// src/services/gemini.service.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const generateAIRecommendations = async (statsContext: any, userContext?: string) => {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `You are an AI advisor for UIDAI's Aadhaar data freshness platform. 

Current Statistics:
- Total Districts Monitored: ${statsContext.totalDistricts}
- High Risk Districts: ${statsContext.highRiskCount}
- Average Freshness Score: ${statsContext.avgFreshnessScore.toFixed(1)}
- Top Risky Districts: ${JSON.stringify(statsContext.topRiskyDistricts)}

${userContext ? `Additional Context: ${userContext}` : ''}

Generate EXACTLY 4 actionable recommendations for UIDAI officials to improve data freshness. Each recommendation should:
1. Have a clear title (max 8 words)
2. Have a description (max 25 words)
3. Be categorized as 'Campaign', 'Service', or 'Infrastructure'
4. Have priority 'High', 'Medium', or 'Low'

Format as JSON array:
[
  {
    "id": "r1",
    "title": "...",
    "description": "...",
    "priority": "High|Medium|Low",
    "actionType": "Campaign|Service|Infrastructure"
  }
]`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Parse JSON from response
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            const recommendations = JSON.parse(jsonMatch[0]);
            return recommendations;
        }

        // Fallback recommendations if parsing fails
        return [
            {
                id: 'r1',
                title: 'Mobile Update Vans',
                description: 'Deploy mobile vans in high-risk districts for doorstep updates.',
                priority: 'High',
                actionType: 'Infrastructure'
            },
            {
                id: 'r2',
                title: 'SMS Awareness Campaign',
                description: 'Launch targeted SMS campaign in districts with low freshness scores.',
                priority: 'High',
                actionType: 'Campaign'
            },
            {
                id: 'r3',
                title: 'Senior Citizen Assistance',
                description: 'Provide dedicated helpline and doorstep service for 60+ age group.',
                priority: 'Medium',
                actionType: 'Service'
            },
            {
                id: 'r4',
                title: 'Aadhaar Center Expansion',
                description: 'Open more enrollment centers in rural high-migration areas.',
                priority: 'Medium',
                actionType: 'Infrastructure'
            }
        ];
    } catch (error) {
        console.error('Gemini API Error:', error);

        // Fallback recommendations
        return [
            {
                id: 'r1',
                title: 'Target High-Risk Districts',
                description: 'Focus resources on districts with Critical and High risk levels.',
                priority: 'High',
                actionType: 'Campaign'
            },
            {
                id: 'r2',
                title: 'Biometric Update Drive',
                description: 'Organize camps for senior citizens to update biometrics.',
                priority: 'High',
                actionType: 'Service'
            },
            {
                id: 'r3',
                title: 'Mobile Linking Initiative',
                description: 'Simplify mobile linking process through online portal.',
                priority: 'Medium',
                actionType: 'Infrastructure'
            },
            {
                id: 'r4',
                title: 'Migration Pattern Analysis',
                description: 'Use AI to predict districts needing intervention.',
                priority: 'Low',
                actionType: 'Infrastructure'
            }
        ];
    }
};

// Generate citizen-specific recommendations based on their district and dashboard data
export const generateCitizenRecommendations = async (citizenData: any, dashboardStats: any) => {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `You are a helpful AI assistant for UIDAI's Aadhaar citizen portal. Help citizens understand their Aadhaar status and recommend actions.

Citizen Information:
- District: ${citizenData.district || 'Unknown'}
- State: ${citizenData.state || 'Unknown'}
- District Risk Level: ${citizenData.districtRisk || 'Unknown'}
- District Freshness Score: ${citizenData.districtFreshness || 0}/100
- Address Status: ${citizenData.demoStatus?.address || 'Unknown'}
- Mobile Status: ${citizenData.demoStatus?.mobile || 'Unknown'}
- Biometric Status: ${citizenData.demoStatus?.biometric || 'Unknown'}

Dashboard Statistics:
- Average Freshness Score: ${dashboardStats.avgFreshnessScore || 0}
- High Risk Districts: ${dashboardStats.highRiskCount || 0}
- Average Update Required: ${dashboardStats.recordsNeedingUpdatePct || 0}%

Provide personalized, friendly recommendations in a conversational tone. Focus on:
1. What actions the citizen should take based on their status
2. Why these actions are important
3. Which areas/districts need attention
4. How to update their Aadhaar details

Format as a friendly, conversational response (max 200 words). Be helpful and clear.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Gemini API Error for citizen:', error);
        
        // Fallback response
        const recommendations = [];
        if (citizenData.demoStatus?.address === 'Stale') {
            recommendations.push('Your address may need updating. High migration detected in your district.');
        }
        if (citizenData.demoStatus?.mobile === 'Unlinked') {
            recommendations.push('Link your mobile number for seamless OTP services.');
        }
        if (citizenData.demoStatus?.biometric === 'Aging') {
            recommendations.push('Consider updating your biometrics, especially if you are 60+ years old.');
        }
        
        return recommendations.length > 0 
            ? `Based on your district's data (${citizenData.district}), here are recommendations: ${recommendations.join(' ')}`
            : 'Your Aadhaar details appear to be in good shape. Keep your information updated for seamless service delivery.';
    }
};