import { SimilarityService } from '../src/services/chat/SimilarityService';
import dotenv from 'dotenv';
dotenv.config();

const QA_PAIRS = [
    {
        question: "What is this domain used for?",
        expectedKeyword: "example",
    }
];

async function runEval() {
    console.log('--- Starting RAG Retrieval Eval ---');
    let passed = 0;

    for (const pair of QA_PAIRS) {
        console.log(`\nEvaluating Q: "${pair.question}"`);
        try {
            const chunks = await SimilarityService.search(pair.question, 5);
            const found = chunks.some(c => c.text.toLowerCase().includes(pair.expectedKeyword.toLowerCase()));
            
            if (found) {
                console.log(`✅ Passed! Found "${pair.expectedKeyword}" in top 5 chunks.`);
                passed++;
            } else {
                console.log(`❌ Failed. Could not find "${pair.expectedKeyword}" in retrieved chunks.`);
            }
        } catch (e) {
            console.error(`❌ Error evaluating: ${e}`);
        }
    }

    console.log(`\n--- Eval Complete ---`);
    console.log(`Passed ${passed}/${QA_PAIRS.length}`);
    process.exit(0);
}

runEval();
