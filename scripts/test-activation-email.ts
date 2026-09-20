import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { isFirstCollectedInvoice } from "../src/lib/activationEmail";
const paid = (id: string, amount_paid = 990, status = "paid") => ({ id, amount_paid, status });
async function* history(rows: ReturnType<typeof paid>[]) { for (const row of rows) yield row; }
async function main() {
 const c=paid("current");
 const cases: [string, ReturnType<typeof paid>, ReturnType<typeof paid>[], boolean][] = [
  ["first monthly", c, [c], true],
  ["first annual", paid("annual",9900), [paid("annual",9900)], true],
  ["trial conversion (cycle invoice)",c,[c,paid("trial",0)],true],
  ["second payment",c,[c,paid("first")],false],
  ["third payment",c,[c,paid("second"),paid("first")],false],
  ["zero trial invoice",paid("trial",0),[paid("trial",0)],false],
  ["failed unpaid",paid("failed",0,"open"),[],false],
  ["paid after failed attempt",c,[c,paid("failed",0,"open")],true],
  ["same invoice replay",c,[c,c],true],
  ["old activation delivered after renewal",c,[paid("newer"),c],false],
  ["older payment beyond first page",c,[c,...Array.from({length:105},(_,i)=>paid(`zero${i}`,0)),paid("old")],false],
  ["missing own history entry",c,[],true],
 ];
 for(const [name,current,rows,want] of cases){assert.equal(await isFirstCollectedInvoice(current,history(rows)),want,name);}
 async function* failure(){yield c;throw new Error("history unavailable");}
 await assert.rejects(isFirstCollectedInvoice(c,failure()),/history unavailable/);
 const route=readFileSync("src/app/api/webhooks/stripe/route.ts","utf8");
 assert.match(route,/if \(customerEmail && sendActivation\)/);
 assert.match(route,/subscription: subscriptionId, status: "paid", limit: 100/);
 assert.match(route,/cleverli-\$\{invoice.id\}-customer/);
 assert.match(route,/if \(event.type === "invoice.paid" && invoice.amount_paid > 0\)/);
 console.log(`${cases.length} behavioral cases + failure propagation + webhook guards PASS`);
}
main().catch(e=>{console.error(e);process.exitCode=1;});
