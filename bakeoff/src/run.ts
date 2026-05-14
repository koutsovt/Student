import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { CONDITIONS, type ConditionId } from './models.config.js';
import { FIXTURES, type Fixture } from './fixtures.js';
import { aggregate, scoreResponse, type Score } from './rubric.js';
import type { CompletionResult } from './llm-client.js';

interface Run {
  condition: string;
  fixture: string;
  iteration: number;
  result: CompletionResult;
  score: Score;
}

const RUNS_PER_CASE = Number(process.env.BAKEOFF_RUNS_PER_CASE ?? 10);
const OUT_DIR = process.env.BAKEOFF_OUT_DIR ?? './results';

const args = process.argv.slice(2);
const onlyCondition = args
  .find((a) => a.startsWith('--condition='))
  ?.split('=')[1] as ConditionId | undefined;

const conditions = onlyCondition ? [CONDITIONS[onlyCondition]] : Object.values(CONDITIONS);

async function runOne(fx: Fixture, conditionId: ConditionId): Promise<CompletionResult> {
  const condition = CONDITIONS[conditionId];
  const client = condition.models[fx.tier]();
  return client.complete({
    system: fx.systemPrompt,
    messages: [{ role: 'user', content: fx.userTurn }],
    tools: fx.tools,
    temperature: 0.3,
    maxTokens: 1024,
  });
}

async function main(): Promise<void> {
  mkdirSync(OUT_DIR, { recursive: true });
  const runs: Run[] = [];

  for (const condition of conditions) {
    for (const fx of FIXTURES) {
      for (let i = 0; i < RUNS_PER_CASE; i++) {
        process.stdout.write(`[${condition.id}] ${fx.id} #${i + 1}/${RUNS_PER_CASE}... `);
        try {
          const result = await runOne(fx, condition.id);
          const score = scoreResponse(fx, result);
          runs.push({ condition: condition.id, fixture: fx.id, iteration: i, result, score });
          process.stdout.write(
            `fidelity=${score.fidelityScore.toFixed(2)} safety=${score.safetyPassed ? 'pass' : 'FAIL'} ` +
            `tok=${result.usage.inputTokens}/${result.usage.outputTokens} ${result.latencyMs}ms\n`,
          );
        } catch (err) {
          process.stdout.write(`ERROR: ${(err as Error).message}\n`);
        }
      }
    }
  }

  const summary = aggregate(runs.map((r) => ({
    condition: r.condition,
    fixture: r.fixture,
    score: r.score,
    result: r.result,
  })));

  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const runsPath = resolve(OUT_DIR, `runs-${stamp}.json`);
  const summaryPath = resolve(OUT_DIR, `summary-${stamp}.json`);
  writeFileSync(runsPath, JSON.stringify(runs, null, 2));
  writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

  console.log('\n=== summary ===');
  console.table(summary.map((s) => ({
    condition: s.condition,
    fixture: s.fixture,
    n: s.n,
    fidelity: s.meanFidelity.toFixed(2),
    safetyPass: `${(s.safetyPassRate * 100).toFixed(0)}%`,
    inTok: Math.round(s.meanInputTokens),
    outTok: Math.round(s.meanOutputTokens),
    p95ms: s.p95LatencyMs,
  })));
  console.log(`\nwrote ${runsPath}`);
  console.log(`wrote ${summaryPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
