import Video from "./video";

type Clip = { title: string; src: string };

const rgbVideos: Clip[] = [
  { title: "Puncher", src: "/videos/rgb/puncher.mp4" },
  { title: "Laptop", src: "/videos/rgb/laptop.mp4" },
  { title: "Trash bin", src: "/videos/rgb/trashbin.mp4" },
  { title: "Monitor", src: "/videos/rgb/monitor.mp4" },
  { title: "Office chair", src: "/videos/rgb/office-chair.mp4" },
  { title: "Dryer", src: "/videos/rgb/dryer.mp4" },
  { title: "Stapler", src: "/videos/rgb/stapler.mp4" },
  { title: "Cabinet", src: "/videos/rgb/cabinet.mp4" },
  { title: "Oven", src: "/videos/rgb/oven.mp4" },
];

const articulationVideos: Clip[] = [
  { title: "Puncher", src: "/videos/puncher.mp4" },
  { title: "Laptop", src: "/videos/laptop.mp4" },
  { title: "Trash bin", src: "/videos/trashbin.mp4" },
  { title: "Monitor", src: "/videos/monitor.mp4" },
  { title: "Office chair", src: "/videos/office-chair.mp4" },
  { title: "Dryer", src: "/videos/dryer.mp4" },
  { title: "Stapler", src: "/videos/stapler.mp4" },
  { title: "Cabinet", src: "/videos/cabinet.mp4" },
  { title: "Oven", src: "/videos/oven.mp4" },
];

const humanHandVideos: Clip[] = [
  { title: "Laptop", src: "/videos/retargeting/laptop.mp4" },
  { title: "Monitor", src: "/videos/retargeting/monitor-reverse.mp4" },
  { title: "Puncher", src: "/videos/retargeting/puncher.mp4" },
];

const allegroHandVideos: Clip[] = [
  { title: "Laptop", src: "/videos/retargeting/allegro/laptop-revers.mp4" },
  { title: "Monitor", src: "/videos/retargeting/allegro/monitor.mp4" },
  { title: "Monitor (reverse)", src: "/videos/retargeting/allegro/monitor-reverse.mp4" },
  { title: "Puncher", src: "/videos/retargeting/allegro/puncher.mp4" },
  { title: "Stapler", src: "/videos/retargeting/allegro/stapler.mp4" },
  { title: "Suitcase", src: "/videos/retargeting/allegro/suitcase-rgb.mp4" },
];

const depthComparison: Clip[] = [
  { title: "RGB-D video", src: "/videos/rgbd-input.mp4" },
  { title: "RGB", src: "/videos/retargeting/allegro/suitcase-rgb.mp4" },
  { title: "RGB-D (depth from iPhone camera)", src: "/videos/retargeting/allegro/suitcase.mp4" },
];

function VideoGrid({ clips, label, rgb = false }: { clips: Clip[]; label: string; rgb?: boolean }) {
  return (
    <div className={`video-grid${rgb ? " rgb-grid" : ""}`}>
      {clips.map((clip) => (
        <figure className="video-example" key={clip.src}>
          <div className="video-frame">
            <Video src={clip.src} label={`${clip.title}: ${label}`} />
          </div>
          <figcaption>{clip.title}</figcaption>
        </figure>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header section-shell">
        <a className="project-brand" href="#top">Track, Articulate, Act</a>
        <nav aria-label="Primary navigation">
          <a href="/paper.pdf" target="_blank" rel="noreferrer">Paper</a>
          <a href="https://arxiv.org/abs/2609.19119" target="_blank" rel="noreferrer">arXiv</a>
          <a href="https://github.com/brains-bots-n-behavior/track-articulate-act" target="_blank" rel="noreferrer">Code</a>
        </nav>
      </header>

      <main id="main">
        <section className="hero section-shell" id="top">
          <h1>
            Track, <span className="title-articulate">Articulate,</span> <span className="title-act">Act</span>{" "}
            <span className="hero-subtitle">Generating Articulation from Casual Human Videos</span>
          </h1>
          <div className="hero-byline">
            <p className="hero-authors">Jiaming Zhang <span>and</span> Homanga Bharadhwaj</p>
            <p className="hero-affiliation">Department of Computer Science, Johns Hopkins University</p>
          </div>
          <a className="hero-lab" href="https://brains-bots-n-behavior.github.io/" target="_blank" rel="noreferrer">
            <img src="/assets/b3lablogo.png" alt="" width="48" height="48" />
            <span>Brains, Bots, and Behavior Lab</span>
          </a>
          <div className="resource-links" aria-label="Paper, arXiv, and code">
            <a className="paper-link" href="/paper.pdf" target="_blank" rel="noreferrer">Paper</a>
            <a className="paper-link" href="https://arxiv.org/abs/2609.19119" target="_blank" rel="noreferrer">arXiv</a>
            <a className="paper-link code-link" href="https://github.com/brains-bots-n-behavior/track-articulate-act" target="_blank" rel="noreferrer">Code</a>
          </div>
          <p className="hero-summary">
            We explore how far pretrained vision models, combined with optimization, can take us in recovering an object’s articulation and re-targeting the observed human interaction in physics simulation, using only a single casually captured monocular video.
          </p>
          <figure className="overview-film">
            <Video src="/videos/teaser-tract-20260916.mp4" label="Teaser for Track, Articulate, Act" />
          </figure>
        </section>

        <section className="paper-section section-shell" id="overview" aria-labelledby="overview-heading">
          <div className="section-heading">
            <h2 id="overview-heading">Overview</h2>
            <p>
              Human videos contain rich causal evidence for robot manipulation: they reveal how hand motion induces object motion and produces task-relevant changes in object state.
              In this work, we study articulated objects such as doors, drawers, cabinets, laptops, ovens, and hinged containers that are ubiquitous in daily life and present unique challenges for embodied interaction.
              These objects cannot be represented by a single pose; their motion depends on the underlying parts and joints.
              We introduce a real-to-sim framework that reconstructs a simulation-ready articulated object and hand–object interaction from a casual monocular RGB video, without RGB-D or multi-view input, prior scans, manually specified joints, or robot demonstrations.
              Our key insight is that dense 3D point tracks provide an embodiment-agnostic articulation cue: points on the fixed link remain approximately stationary, while points on the moving link follow coherent revolute or prismatic motion.
              Our method segments the links, estimates the joint and its state trajectory, reconstructs an articulated asset, and aligns the recovered 3D hand motion with the object.
              Central to our approach is a modular recipe that repurposes powerful pretrained models for single-image 3D reconstruction, mesh segmentation, and 3D scene flow, connecting their predictions through explicit geometric reasoning to infer articulation.
              We use the reconstructed articulated object and the human hand trajectory to replay interactions through contact in MuJoCo.
              The framework shows how pretrained vision models and explicit motion reasoning can turn casual human videos into articulated object models suitable for downstream embodied interactions.
            </p>
          </div>
        </section>

        <section className="paper-section section-shell" id="method" aria-labelledby="method-heading">
          <div className="section-heading">
            <h2 id="method-heading">Method</h2>
            <p>
              We start with a few frames that show different articulation states and where the hand obscures as little of the object as possible.
              SAM 3 tracks the object and hand masks, SAM 3D reconstructs an object mesh from each selected frame, and Depth Anything 3 estimates depth and camera geometry.
              We use part masks to guide SegviGen in separating each mesh into static and moving links, then align the reconstructions through the static link.
            </p>
          </div>
          <div className="method-film">
            <Video src="/videos/method.mp4" label="Track, Articulate, Act method animation" />
          </div>
          <div className="method-notes">
            <div>
              <h3>Track</h3>
              <p>
                TrackCraft3R follows points across the video. We lift these tracks into 3D, separate static and moving trajectories, and use them to guide the part masks.
                Grounding the tracks on the registered meshes brings the motion and geometry into a common object frame.
              </p>
            </div>
            <div>
              <h3>Articulate</h3>
              <p>
                We fit revolute and prismatic joint hypotheses to the moving points, then refine the joint and its motion against the tracks and object silhouettes.
                We fuse the aligned link meshes and add joint limits and collision geometry to form a simulation-ready asset.
              </p>
            </div>
            <div>
              <h3>Act</h3>
              <p>
                HaWoR recovers the 3D hand trajectory. We align its scale and pose with the object, then re-target the motion to a simulated hand in MuJoCo.
                The object joint stays passive, so its movement comes from hand contact rather than a commanded joint trajectory.
              </p>
            </div>
          </div>
        </section>

        <section className="paper-section section-shell" id="rgb-videos" aria-labelledby="rgb-heading">
          <div className="section-heading">
            <h2 id="rgb-heading">Human videos</h2>
            <p>The RGB recordings used to reconstruct these objects and their motion.</p>
          </div>
          <VideoGrid clips={rgbVideos} label="RGB input video" rgb />
        </section>

        <section className="paper-section section-shell" id="results" aria-labelledby="results-heading">
          <div className="section-heading">
            <h2 id="results-heading">Recovered articulation</h2>
            <p>The reconstructed objects and their joints, in the same order as the input videos above.</p>
          </div>
          <VideoGrid clips={articulationVideos} label="recovered articulation" />
        </section>

        <section className="paper-section section-shell" id="retargeting" aria-labelledby="simulation-heading">
          <div className="section-heading">
            <h2 id="simulation-heading">Actionable simulation results</h2>
            <p>We replay the recovered interactions in MuJoCo with a human hand and an Allegro robot hand, demonstrating how the reconstructed articulated object can be reliably manipulated.</p>
          </div>
          <section className="simulation-group" id="human-hand" aria-labelledby="human-hand-heading">
            <h3 id="human-hand-heading">Retargeting to a simulated human hand</h3>
            <VideoGrid clips={humanHandVideos} label="retargeting to a simulated human hand" />
          </section>
          <section className="simulation-group" id="allegro-hand" aria-labelledby="allegro-hand-heading">
            <h3 id="allegro-hand-heading">Retargeting to a simulated robot hand (Allegro)</h3>
            <VideoGrid clips={allegroHandVideos} label="retargeting to a simulated Allegro robot hand" />
          </section>
        </section>

        <section className="paper-section section-shell depth-comparison" id="rgbd-comparison" aria-labelledby="rgbd-heading">
          <div className="section-heading">
            <h2 id="rgbd-heading">Comparison with RGB-D</h2>
            <p>
              When depth from an iPhone camera is available, our framework can use it directly to improve the result.
              Below, we compare the same suitcase interaction using RGB alone and RGB-D with iPhone depth.
            </p>
          </div>
          <VideoGrid clips={depthComparison} label="suitcase retargeting comparison" />
        </section>
      </main>

      <footer className="section-shell">
        <a className="lab-lockup" href="https://brains-bots-n-behavior.github.io/" target="_blank" rel="noreferrer">
          <img src="/assets/b3lablogo.png" alt="" width="44" height="44" />
          <span>Brains, Bots, and Behavior Lab<small>Johns Hopkins University</small></span>
        </a>
        <a href="/paper.pdf" target="_blank" rel="noreferrer">Track, Articulate, Act</a>
      </footer>
    </>
  );
}
