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
        <li>Pick any two points that do not have the same y-axis on the curve and draw a line between them. This line will alway intersect the curve at <em>a third point</em> also on the curve.</li>
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
        <li>Draw the straight line through <InlineMath tex="P"/> and <InlineMath tex="Q"/>.</li>
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
        problem (ECDLP)</strong>. No one knows how to do it faster than square root time on a classical computer (the square root complexity comes from baby-step, giant-step brute force). Therefore, a small elliptic curve can achieve the same level of hardness in the discrete log problem as a large Galois Field that uses modular arithmetic. 
      </p>
      <p>An example usage of the elliptic curve is in asymmetric encryption schemes, where <InlineMath tex="k"/> is used as the private key and <InlineMath tex="k\cdot P"/> is used as the public key. Other usages include the Diffie-Hellman key exchange and the digital signiture authentication scheme (DSA).</p>

      <h2>Try it</h2>
      <p>
        Close this post, hover over the background, click a few times. Every click is a
        real addition in the group <InlineMath tex="E(\mathbb{R})"/>. It is the same operation that,
        scaled up to a 256-bit prime field, is deciding right now whether a stranger
        can spend your money.
      </p>
    </article>
  );
}
