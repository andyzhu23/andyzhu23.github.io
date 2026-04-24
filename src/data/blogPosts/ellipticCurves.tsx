import { InlineMath, BlockMath } from '../../components/Math';
import type { BlogPostMeta } from './types';

export const meta: BlogPostMeta = {
  slug: 'elliptic-curve-on-my-homepage',
  title: 'The elliptic curve on my homepage, demystified',
  date: 'April 24, 2026',
  description:
    'What the animated curve behind every page is actually computing — and why the same operation secures half the internet.',
  tags: ['cryptography', 'math', 'canvas'],
  readingMinutes: 6,
};

export default function EllipticCurvesPost() {
  return (
    <article className="blog-article">
      <p className="blog-lead">
        The faint curve in the background of this site is an illustration of the elliptic curve. While it may just seem like a gimmick, it is actually widely used in cryptography. The TLS handshake that allows you to connect to this site securely at this very moment is most likely done with the same elliptic curve.
      </p>

      <h2>The curve</h2>
      <p>
        The equation is <InlineMath tex="y^2 = x^3 − x + 1"/>. Plot it and you get a smooth,
        slightly lopsided shape that loops through the plane. Two things about it are
        mathematically special, and neither is obvious from the picture:
      </p>
      <ol>
        <li>Pick any two points on the curve that do not share the same x-coordinate, and draw a line between them. This line will always intersect the curve at <em>exactly one other point</em>. Reflect that point across the x-axis and you get a third point on the curve — this is defined as the <em>sum</em> of the original two.</li>
        <li>That addition turns the set of points into a <em>group</em> — the same
        algebraic structure as integers under <InlineMath tex="+"/>, just geometric.</li>
      </ol>
      <p>
        This turns out to be extremely useful in cryptography.
      </p>

      <h2>How two points add</h2>
      <p>
        Given points <InlineMath tex="P"/> and <InlineMath tex="Q"/> on the curve, here is the recipe:
      </p>
      <ol>
        <li>Draw the straight line through <InlineMath tex="P"/> and <InlineMath tex="Q"/>. (If <InlineMath tex="P = Q"/>, the line is ambiguous — use the tangent to the curve at <InlineMath tex="P"/> instead. This case is called <em>point doubling</em>, and it is what makes scalar multiplication efficient.)</li>
        <li>A cubic curve and a line intersect in exactly three points (counted with multiplicity). Call the third one <InlineMath tex="R"/>.</li>
        <li>Reflect <InlineMath tex="R"/> across the x-axis. That reflection is <InlineMath tex="P + Q"/>.</li>
      </ol>
      <p>
        If you hover your cursor over the background, the site picks the
        nearest curve point <InlineMath tex="Q"/> to your mouse and draws the chord
        <InlineMath tex="P \to Q"/> in real time. Click, and it actually performs the addition —
        <InlineMath tex="P"/> jumps to <InlineMath tex="P + Q"/> with an animated transition.
      </p>
      <p className="blog-callout">
        The reflection step looks arbitrary, but it is the price you pay for having an
        identity element. The <em>point at infinity</em> — the formal "zero" of this
        group — lives at the top and bottom of every vertical line, which is why
        reflecting across the x-axis works out to negation.
      </p>

      <h2>Why this matters outside my background canvas</h2>
      <p>
        Once you have a group, you can do multiplication:
      </p>
      <BlockMath tex="k\cdot P = \underbrace{P + P + \cdots + P}_{k \text{ times}}"/>
      <p>
        Naively this is slow, but with repeated doubling it runs in <InlineMath tex="O(\log k)"/>. Fast.
      </p>
      <p>
        The <em>reverse</em> problem — given <InlineMath tex="P"/> and <InlineMath tex="k \cdot P"/>,
        recover <InlineMath tex="k"/> — is called the <strong>elliptic curve discrete log
        problem (ECDLP)</strong>. The best known classical attacks (Pollard's rho, baby-step giant-step) run in roughly <InlineMath tex="\sqrt{n}"/> time. What makes elliptic curves attractive is the lack of a known subexponential attack unlike the multiplicative group <InlineMath tex="\mathbb{Z}_p^*"/>. No analogous attack is known for generic elliptic curves, so 256-bit curves match the security of ~3000-bit classical keys.
      </p>
      <p>An example usage of the elliptic curve is in asymmetric encryption schemes, where a randomly chosen <InlineMath tex="d"/> is the private key and <InlineMath tex="d\cdot P"/> is the public key. Other usages include the Diffie-Hellman key exchange and the Digital Signature Algorithm (DSA).</p>

      <h2>Elliptic Curve Digital Signature Algorithm (ECDSA)</h2>

      <p>I genuinely found ECDSA to be quite fascinating, and I will briefly explain it in my own words.</p>
      <p>One notational convenience first: let <InlineMath tex="\pi_x: \mathbb{E}(\mathbb{F}_q) \to \mathbb{F}_q"/> denote the projection that sends a curve point to its x-coordinate, so <InlineMath tex="\pi_x(x, y) = x"/>. This lets us cleanly talk about "the x-coordinate of a point, reduced mod <InlineMath tex="n"/>" without fudging types.</p>
      <ul>
        <li>Given <InlineMath tex="(\mathbb{E}(\mathbb{F}_q), P, n)"/> and <InlineMath tex="H: \{0,1\}^* \to \mathbb{Z}_n"/>:
          <ul>
            <li><InlineMath tex="\mathbb{E}(\mathbb{F}_q)"/> is an elliptic curve over the finite field <InlineMath tex="\mathbb{F}_q"/> </li>
            <li><InlineMath tex="P"/> is a point on the curve that generates a large cyclic subgroup of prime order <InlineMath tex="n"/></li>
            <li><InlineMath tex="H"/> is a hash function that maps messages to integers modulo <InlineMath tex="n"/></li>
          </ul>
        </li>
        <li>Key generation: choose a random integer <InlineMath tex="d \in \mathbb{Z}_n"/> as the private key, and compute the public key as <InlineMath tex="Y = d\cdot P"/>.</li>
        <li>Signing: to sign a message <InlineMath tex="m"/>, choose a random nonce <InlineMath tex="k"/> and compute <BlockMath tex="r = \pi_x(k\cdot P) \bmod n."/> Then compute <InlineMath tex="s = k^{-1}(H(m) + rd) \bmod n"/> and publish the signature <InlineMath tex="(r, s)"/>.</li>
        <li>Verification: given <InlineMath tex="(r, s)"/>, the message <InlineMath tex="m"/>, and the public key <InlineMath tex="Y"/>, accept iff
          <BlockMath tex="\pi_x\!\left(s^{-1}\cdot (H(m)\cdot P + r\cdot Y)\right) \bmod n = r."/>
          Crucially, this expression uses only public values — the private key <InlineMath tex="d"/> appears only implicitly through <InlineMath tex="Y = d\cdot P"/>, so the verifier never needs to know it.
          <p>To see why the check works, rearrange the signing equation as <InlineMath tex="k \equiv s^{-1}(H(m) + rd) \pmod n"/> and multiply both sides by <InlineMath tex="P"/>:</p>
          <BlockMath tex="\begin{aligned}
          k\cdot P &= s^{-1}\cdot (H(m) + rd)\cdot P \\
          &= s^{-1}\cdot \left(H(m)\cdot P + rd\cdot P\right) \\
          &= s^{-1}\cdot \left(H(m)\cdot P + r\cdot Y\right)
          \end{aligned}"/>
          <p>using <InlineMath tex="Y = d\cdot P"/> in the last step. Apply <InlineMath tex="\pi_x"/> to both sides and reduce mod <InlineMath tex="n"/>. The left-hand side is <InlineMath tex="r"/> by definition, so the verification check holds.</p>
        </li>
      </ul>
      <p>Security rests on the ECDLP: an attacker who sees only <InlineMath tex="Y"/> cannot recover <InlineMath tex="d"/>, so cannot craft a valid <InlineMath tex="s"/> for a chosen message.</p>

      <h2>Try it</h2>
      <p>
        Close this post, hover over the background, click a few times. Every click is a
        real addition in the group <InlineMath tex="\mathbb{E}(\mathbb{R})"/>. It is the same operation that,
        scaled up to a 256-bit prime field, is deciding right now whether a stranger
        can spend your money.
      </p>
    </article>
  );
}
