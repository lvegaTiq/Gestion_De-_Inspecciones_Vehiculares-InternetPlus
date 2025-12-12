import request from "supertest";
import { expect } from "chai";
import app from "../../app.js"

describe("GET /health", () => {
  it("debe responder ok:true", async () => {
    const res = await request(app).get("/health");

    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal({ ok: true });
  });
});
