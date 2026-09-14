import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  return new Response(await readFile(new URL("../index.html", import.meta.url), "utf8"), {
    headers: { "content-type": "text/html" },
  });
}

test("exports the complete project page as static HTML", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>?[^<]*Track, Articulate, Act/i);
  assert.match(html, /<title>Track, Articulate, Act Generating Articulation from Casual Human Videos<\/title>/);
  assert.doesNotMatch(html, /LLM-free Generation of Articulation/);
  const heading = html.match(/<h1>(.*?)<\/h1>/s)?.[1].replace(/<[^>]*>/g, "");
  assert.equal(heading, "Track, Articulate, Act Generating Articulation from Casual Human Videos");
  assert.match(html, /Jiaming Zhang/i);
  assert.match(html, /Homanga Bharadhwaj/i);
  assert.match(html, /Department of Computer Science, Johns Hopkins University/i);
  const hero = html.match(/<section[^>]*id="top"[\s\S]*?<\/section>/)?.[0] ?? "";
  const lab = hero.match(/<a class="hero-lab"[^>]*>[\s\S]*?<\/a>/)?.[0] ?? "";
  assert.match(lab, /href="https:\/\/brains-bots-n-behavior\.github\.io\/"/);
  assert.match(lab, /<img[^>]*src="\/assets\/b3lablogo\.png"/);
  assert.match(lab, /Brains, Bots, and Behavior Lab/);
  assert.ok(hero.indexOf('class="hero-lab"') > hero.indexOf('class="hero-affiliation"'));
  assert.ok(hero.indexOf('class="hero-lab"') < hero.indexOf('class="resource-links"'));
  assert.match(html, /<p class="hero-summary">We explore how far pretrained vision models, combined with optimization, can take us in recovering an object’s articulation and re-targeting the observed human interaction in physics simulation, using only a single casually captured monocular video\.<\/p>/);
  assert.doesNotMatch(html, /without an LLM in the loop|Track, Articulate, Act:/);
  assert.match(html, /RGB-D \(depth from iPhone camera\)/);
  assert.doesNotMatch(html, /ground-truth depth|A human video, a reconstructed object, and the interaction in simulation/);
  for (const model of ["SAM 3D", "Depth Anything 3", "SegviGen", "TrackCraft3R", "HaWoR"]) {
    assert.ok(html.includes(model), `Method should explain ${model}`);
  }
  const overview = html.match(/<section[^>]*id="overview"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.equal([...overview.matchAll(/<p>/g)].length, 1);
  assert.match(overview, /Human videos contain rich causal evidence for robot manipulation/);
  assert.match(overview, /These objects cannot be represented by a single pose/);
  assert.match(overview, /embodiment-agnostic articulation cue/);
  assert.match(overview, /explicit geometric reasoning/);
  assert.match(overview, /replay interactions through contact in MuJoCo/);
  assert.match(overview, /suitable for downstream embodied interactions/);
  assert.match(html, /Allegro robot hand, demonstrating how the reconstructed articulated object can be reliably manipulated/);
  assert.match(html, /object joint stays passive/);
  assert.doesNotMatch(html, /class="teaser-intro"/);
  assert.match(html, /class="title-articulate"/);
  assert.match(html, /Recovered articulation/i);
  assert.match(html, /Human videos/i);
  assert.match(html, /Actionable simulation results/i);
  assert.match(html, /Retargeting to a simulated human hand/i);
  assert.match(html, /Retargeting to a simulated robot hand \(Allegro\)/i);
  assert.match(html, /\/videos\/teaser\.mp4/i);
  assert.match(html, /\/videos\/method\.mp4/i);
  assert.match(html, /\/videos\/cabinet\.mp4/i);
  assert.match(html, /\/videos\/dryer\.mp4/i);
  assert.match(html, /\/videos\/oven\.mp4/i);
  assert.match(html, /\/videos\/retargeting\/laptop\.mp4/i);
  assert.match(html, /\/videos\/retargeting\/monitor-reverse\.mp4/i);
  assert.match(html, /\/videos\/retargeting\/puncher\.mp4/i);
  assert.doesNotMatch(html, /\/videos\/retargeting\/(stapler-reverse|suitcase)\.mp4/i);
  assert.doesNotMatch(html, /video\/quicktime|\.mov/i);
  assert.doesNotMatch(html, /Result video|Current scope/i);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
  assert.doesNotMatch(html, /3DV|anonymous|paper #478|submission #478|local review preview/i);
});

test("ships the required local media", async () => {
  const response = await render();
  const html = await response.text();
  const videos = [...html.matchAll(/<source\b[^>]*src="([^"]+)"/g)].map((match) => match[1]);
  const posters = [...html.matchAll(/<video\b[^>]*poster="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(videos.filter((src) => src.startsWith("/videos/rgb/")).length, 9);
  assert.equal(videos.filter((src) => src.startsWith("/videos/retargeting/allegro/")).length, 8);
  assert.equal(videos.filter((src) => /^\/videos\/retargeting\/[^/]+$/.test(src)).length, 3);
  assert.equal(posters.length, videos.length);
  await Promise.all([...videos, ...posters, "/paper.pdf"].map((path) =>
    access(new URL(`..${path}`, import.meta.url)),
  ));

  const packageJson = await readFile(new URL("../package.json", import.meta.url), "utf8");
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});

test("packages a self-contained branch-based GitHub Pages site", async () => {
  await access(new URL("../.nojekyll", import.meta.url));
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  const resources = [...html.matchAll(/(?:src|href|poster)="(\/[^"#?]+)"/g)].map((match) => match[1]);
  await Promise.all(resources.map((resource) => access(new URL(`..${resource}`, import.meta.url))));
  assert.doesNotMatch(html, /localhost|127\.0\.0\.1|cloudflare:|__vite_ping/);
  const manifest = JSON.parse(await readFile(new URL("../.pages-manifest.json", import.meta.url), "utf8"));
  assert.ok(manifest.includes("index.html"));
  assert.ok(manifest.includes("videos/method.mp4"));
  assert.ok(!manifest.includes("videos/overview.mp4"));
  assert.deepEqual(
    await readFile(new URL("../paper.pdf", import.meta.url)),
    await readFile(new URL("../public/paper.pdf", import.meta.url)),
    "The published paper must match the source PDF",
  );
});

test("shares the original research imagery in a landscape link preview", async () => {
  const html = await (await render()).text();
  const imageUrl = "https://track-articulate-act.github.io/assets/social-preview-v2.png";
  assert.ok(html.includes(`<meta property="og:image" content="${imageUrl}"`));
  assert.ok(html.includes(`<meta name="twitter:image" content="${imageUrl}"`));
  assert.match(html, /<meta property="og:image:width" content="1200"/);
  assert.match(html, /<meta property="og:image:height" content="630"/);
  assert.match(html, /<meta property="og:image:alt" content="Original laptop video/);
  assert.doesNotMatch(html, /(?:property="og:image"|name="twitter:image") content="[^"]*\/og\.png"/);

  const image = await readFile(new URL("../assets/social-preview-v2.png", import.meta.url));
  assert.equal(image.subarray(1, 4).toString(), "PNG");
  assert.equal(image.readUInt32BE(16), 1200);
  assert.equal(image.readUInt32BE(20), 630);
  assert.deepEqual(image, await readFile(new URL("../public/assets/social-preview-v2.png", import.meta.url)));
  assert.deepEqual(image, await readFile(new URL("../og.png", import.meta.url)));
});
