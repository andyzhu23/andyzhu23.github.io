import { InlineMath, BlockMath } from '../../components/Math';
import type { BlogPostMeta } from './types';

export const meta: BlogPostMeta = {
  slug: 'fri-low-degree-test',
  title: 'FRI: fast low-degree testing by recursive folding',
  date: 'April 24, 2026',
  description:
    'How a clever split of a polynomial into its even and odd parts lets a verifier check degree in O(log d) queries — the recursive trick behind modern STARKs.',
  tags: ['cryptography', 'math', 'zk-proofs'],
  readingMinutes: 7,
};

export default function FriPost() {
  return (
    <article className="blog-article">
      <p className="blog-lead">
        FRI — <em>Fast Reed-Solomon Interactive Oracle Proof of Proximity</em> — is a beautifully compact protocol that sits at the heart of most modern transparent SNARKs (Succinct Non-interactive Arguments of Knowledge). The problem it solves sounds innocent: given oracle access to a function <InlineMath tex="f: L \to \mathbb{F}"/>, convince me with <em>few queries</em> that <InlineMath tex="f"/> is close to a polynomial of degree at most <InlineMath tex="d"/>. The trick that makes it work is a single algebraic identity, applied recursively.
      </p>

      <h2>The setting</h2>
      <p>
        Let <InlineMath tex="\mathbb{F}"/> be a finite field and let <InlineMath tex="L \subseteq \mathbb{F}"/> be a multiplicative subgroup of size <InlineMath tex="|L|"/>, a power of two — so <InlineMath tex="L"/> is the set of <InlineMath tex="|L|"/>-th roots of unity. The prover hands the verifier (oracle access to) a function <InlineMath tex="f : L \to \mathbb{F}"/> and claims that <InlineMath tex="f"/> is the evaluation of some polynomial <InlineMath tex="P"/> of degree at most <InlineMath tex="d"/>. Without loss of generality, pad <InlineMath tex="d"/> to the next power of two.
      </p>
      <p>
        The naive check — set up the Vandermonde system from <InlineMath tex="d+1"/> evaluations, solve it with Gaussian elimination, and inspect the recovered coefficients — costs <InlineMath tex="O(d^3)"/> and reads <em>every</em> value of <InlineMath tex="f"/>. FRI, on the other hand, gets away with <InlineMath tex="O(1)"/> queries per round over <InlineMath tex="O(\log d)"/> rounds.
      </p>

      <h2>The folding identity</h2>
      <p>
        Every univariate polynomial splits cleanly into its even and odd parts:
      </p>
      <BlockMath tex="P(x) = P_{\text{even}}(x^2) + x \cdot P_{\text{odd}}(x^2),"/>
      <p>
        where <InlineMath tex="P_{\text{even}}"/> and <InlineMath tex="P_{\text{odd}}"/>
        each have degree at most <InlineMath tex="d/2"/>. This is just collecting terms
        by parity — nothing deep — but it is the entire engine of FRI.
      </p>
      <p>
        The verifier sends a random challenge <InlineMath tex="r \in \mathbb{F}"/> and
        asks the prover to commit to a new function <InlineMath tex="g"/> that encodes
      </p>
      <BlockMath tex="P'(x) = P_{\text{even}}(x) + r \cdot P_{\text{odd}}(x),"/>
      <p>
        a polynomial of degree at most <InlineMath tex="d/2"/>, over the smaller domain <InlineMath tex="L' = \{\beta : \beta = \alpha^2, \alpha \in L\}"/>. <InlineMath tex="L'"/> is exactly the set of <InlineMath tex="(|L|/2)"/>-th roots of unity — the squaring map is two-to-one on a subgroup of even order, so the domain halves each round. Therefore, a total of <InlineMath tex="O(\log d)"/> rounds drives the degree down to a constant, which the verifier can check by sampling a few points.
      </p>

      <h2>The consistency check</h2>
      <p>
        The verifier now needs to make sure <InlineMath tex="g"/> is really the fold of <InlineMath tex="f"/>, not some unrelated polynomial the prover made up. To do this, it picks a random <InlineMath tex="\beta \in L'"/> and queries the two preimages <InlineMath tex="\alpha_0, \alpha_1 \in L"/> with <InlineMath tex="\alpha_0^2 = \alpha_1^2 = \beta"/>. Note <InlineMath tex="\alpha_1 = -\alpha_0"/>. From
      </p>
      <BlockMath tex="f(\alpha_i) = P_{\text{even}}(\beta) + \alpha_i \cdot P_{\text{odd}}(\beta)"/>
      <p>
        the verifier solves the 2×2 linear system:
      </p>
      <BlockMath tex="\begin{aligned}
      P_{\text{odd}}(\beta)  &= \frac{f(\alpha_1) - f(\alpha_0)}{\alpha_1 - \alpha_0}, \\[4pt]
      P_{\text{even}}(\beta) &= \frac{\alpha_1\, f(\alpha_0) - \alpha_0\, f(\alpha_1)}{\alpha_1 - \alpha_0}.
      \end{aligned}"/>
      <p>
        Having both pieces, the verifier queries <InlineMath tex="g(\beta)"/> and accepts this round iff
      </p>
      <BlockMath tex="g(\beta) \;=\; P_{\text{even}}(\beta) + r \cdot P_{\text{odd}}(\beta)."/>
      <p className="blog-callout">
        Three queries — <InlineMath tex="f(\alpha_0)"/>, <InlineMath tex="f(\alpha_1)"/>, <InlineMath tex="g(\beta)"/> — are all it takes to cross-check one step of the fold. The prover cannot cheat by choosing a <InlineMath tex="g"/> inconsistent with <InlineMath tex="f"/> without being caught with high probability over the random <InlineMath tex="\beta"/>.
      </p>

      <h2>Recursion and the base case</h2>
      <p>
        What <InlineMath tex="g"/> represents is another Reed-Solomon codeword, but over a domain of half the size and for a polynomial of half the degree. So run the protocol again. And again. After <InlineMath tex="\log d"/> rounds the degree bound is driven down to <InlineMath tex="0"/>: the final oracle should be a constant function. The verifier samples a handful of points on the final domain <InlineMath tex="L_{\text{final}}"/> and checks they all agree.
      </p>
      <p>
        Each round costs <InlineMath tex="O(1)"/> queries, the recursion has depth <InlineMath tex="O(\log d)"/>, so the verifier's total query complexity is <InlineMath tex="O(\log d)"/>. That is an exponential win over reading the whole codeword.
      </p>

      <h2>Why this matters</h2>
      <p>
        Low-degree testing is the workhorse primitive behind polynomial interactive oracle proofs (IOPs). IOPs are extremely useful in cryptography, as complex constraints can be encoded as low-degree polynomials, and a computationally bounded verifier can be convinced of the integrity of a prover very efficiently through FRI. For example, in a transparent SNARK, the prover encodes the execution trace of a program as a low-degree polynomial and uses FRI to convince the verifier that the trace is valid. I glossed over the soundness analysis here (there is real subtlety in how "close to low-degree" propagates through folding), but the mechanics — split, fold, recurse — are the whole idea.
      </p>

      <h2>How I found out about FRI</h2>
      <p>
        I first encountered FRI when I was working on my third year dissertation project. The extension of my dissertation was to implement the Reed-Muller PCP construction. The Reed-Muller PCP required a low-degree test as a subroutine. The Reed-Muller code encodes multivariate polynomials, but a reduction to the univariate case is possible by picking a random line through the domain and restricting the function to that line. Then, the low-degree test is just over Reed-Solomon codes.
      </p>
      <p>
        Unfortunately, I did not find out about the FRI protocol in time for the project, so I used an Inverse Number-Theoretic Transform (INTT) to extract coefficients by querying roots of unity in <InlineMath tex="O(d \log d)"/> time, and I thought I was being quite clever. When I later learned about FRI, I was blown away by how much more efficient it was, and how simple the core idea was. Coincidentally, the core idea of folding in FRI was very similar to the even-odd decomposition used in the Fast-Fourier Transform implementation of INTT. The recursive structure of FRI was also very similar to the recursive structure of the sum-check protocol used in the Reed-Muller PCP. I was surprised that such a simple idea of folding could lead to such a powerful protocol, and it was a great example of how a clever algebraic identity can lead to a significant improvement in efficiency.
      </p>
      <h2>References</h2>
      <ul>
        <li>
          Ben-Sasson, Bentov, Horesh, Riabzev.{' '}
          <a
            href="https://eccc.weizmann.ac.il/report/2017/134/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Fast Reed-Solomon Interactive Oracle Proofs of Proximity
          </a>
          , ECCC TR17-134 (2018) — the original FRI paper.
        </li>
      </ul>
    </article>
  );
}
