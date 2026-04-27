import { InlineMath, BlockMath } from '../../components/Math';
import type { BlogPostMeta } from './types';

export const meta: BlogPostMeta = {
  slug: 'discrete-fourier-transform',
  title: 'The Discrete Fourier Transform',
  date: 'April 27, 2026',
  description:
    'From continuous frequencies to roots of unity — how the DFT, FFT, and NTT turn O(n²) convolutions into O(n log n), with applications in competitive programming and the real world.',
  tags: ['math', 'algorithms', 'signal-processing'],
  readingMinutes: 8,
};

export default function DiscreteFourierTransformPost() {
  return (
    <article className="blog-article">
      <p className="blog-lead">
        There are several ways to represent a signal, and here we care primarily about two: the <em>time-domain</em> view, which plots the signal's value at every moment in time, and the <em>frequency-domain</em> view, which plots the magnitude of every pure frequency component that adds up to the signal. The Fourier transform is the mathematical operation that translates between those views. In a computer, signals are usually represented as a finite list of samples rather than a continuous function, so the Fourier transform's discrete cousin — the <strong>Discrete Fourier Transform (DFT)</strong> — is the version of that dictionary a computer can actually compute on those <InlineMath tex="N"/> samples.
      </p>

      <h2>A pure tone, and a sum of pure tones</h2>
      <p>
        It is known that <InlineMath tex="\sin"/> and <InlineMath tex="\cos"/> waves of different frequencies are orthogonal to each other — they are the Fourier transform's version of the standard basis vectors. Any signal can be built by adding up scaled versions of those pure tones, and the Fourier transform answers the question: how much of each pure tone do I need to add together to get my signal? Concretely, this looks like an inner product between the signal and a probe at frequency <InlineMath tex="\omega"/>, integrated over all of time — exactly the way you would project a vector onto a basis direction.
      </p>
      <p>
        There is one wrinkle, though. A pure frequency in a real signal carries two pieces of information: how loud it is (its <em>amplitude</em>) and where its peaks line up in time (its <em>phase</em>). A single <InlineMath tex="\cos(\omega t)"/> probe only matches signals whose peaks coincide with the cosine's peaks — a sine wave at the same frequency, shifted by a quarter period, would integrate to zero against it and look invisible. The fix is Euler's identity <InlineMath tex="e^{-i\omega t} = \cos(\omega t) - i\sin(\omega t)"/>, which bundles a cosine probe and a sine probe into one complex number. A single integral against this complex probe picks up both the in-phase and the out-of-phase content of the signal at once:
      </p>
      <BlockMath tex="X(\omega) = \int_{-\infty}^{\infty} x(t)\, e^{-i\omega t}\, dt."/>
      <p>
        The real part of <InlineMath tex="X(\omega)"/> records how much of the signal aligns with <InlineMath tex="\cos(\omega t)"/>, the imaginary part with <InlineMath tex="\sin(\omega t)"/>. The magnitude <InlineMath tex="|X(\omega)|"/> is the amplitude at frequency <InlineMath tex="\omega"/> and the argument <InlineMath tex="\arg X(\omega)"/> is its phase — both at once, in a single number.
      </p>

      <h2>From continuous to discrete</h2>
      <p>
        A computer cannot see continuous functions, only samples over discrete time. We denote those samples as an array of length <InlineMath tex="N"/>: <InlineMath tex="x_0, x_1, \dots, x_{N-1}"/>. The DFT is the version of the Fourier transform that works on this array.
      </p>
      <p>
        An interesting consequence of discretising time is that we have to discretise frequency too — but which frequencies should we pick? Two constraints settle the answer. First, <InlineMath tex="N"/> samples only carry <InlineMath tex="N"/> independent pieces of information, so we should pick exactly <InlineMath tex="N"/> frequencies; any more would make the system redundant. Second, we want our <InlineMath tex="N"/> probes to be mutually orthogonal on the sample grid — the same way <InlineMath tex="\sin"/> and <InlineMath tex="\cos"/> at different frequencies were orthogonal on the continuous line — so that recovering the signal from its frequency components stays a clean inner-product calculation.
      </p>
      <p>
        The frequencies that satisfy both conditions are exactly those that fit a whole number of periods into the <InlineMath tex="N"/>-sample window: <InlineMath tex="\omega_k = 2\pi k / N"/> for <InlineMath tex="k = 0, 1, \dots, N-1"/>. Plugging that into the continuous probe <InlineMath tex="e^{-i\omega t}"/> at integer time-step <InlineMath tex="n"/> gives the discrete probe <InlineMath tex="e^{-2\pi i kn / N}"/>. The integral collapses into a sum, and the Fourier transform contracts to its discrete shadow:
      </p>
      <BlockMath tex="X_k \;=\; \sum_{n=0}^{N-1} x_n\, e^{-2\pi i kn / N}, \qquad k = 0, 1, \dots, N-1."/>
      <p>
        That is the entire DFT. Read it as: <strong>row <InlineMath tex="k"/> is a probe at frequency <InlineMath tex="k"/>, and <InlineMath tex="X_k"/> is the inner product of the signal with that probe</strong>. The inverse DFT is the same formula with the sign of the exponent flipped — <InlineMath tex="e^{+2\pi i kn/N}"/> instead of <InlineMath tex="e^{-2\pi i kn/N}"/> — and an extra factor of <InlineMath tex="1/N"/>; the rows are <em>orthogonal</em>, so reconstruction is just resolving a vector against an orthogonal basis.
      </p>

      <h2>The FFT: getting to <InlineMath tex="O(n \log n)"/></h2>
      <p>
        Computing the DFT directly is <InlineMath tex="O(N^2)"/>: <InlineMath tex="N"/> probes, <InlineMath tex="N"/> multiplications each. The <em>Fast Fourier Transform</em> of Cooley and Tukey gets it down to <InlineMath tex="O(N \log N)"/> by exploiting one tiny algebraic identity. Start from the definition and split the sum by parity of <InlineMath tex="n"/>:
      </p>
      <BlockMath tex="X_k \;=\; \sum_{n=0}^{N-1} x_n\, e^{-2\pi i kn / N} \;=\; \sum_{n \text{ even}} x_n\, e^{-2\pi i kn / N} \;+\; \sum_{n \text{ odd}} x_n\, e^{-2\pi i kn / N}."/>
      <p>
        Re-index the two halves with <InlineMath tex="n = 2m"/> for the even part and <InlineMath tex="n = 2m + 1"/> for the odd part, where <InlineMath tex="m"/> runs from <InlineMath tex="0"/> to <InlineMath tex="N/2 - 1"/>:
      </p>
      <BlockMath tex="X_k \;=\; \sum_{m=0}^{N/2-1} x_{2m}\, e^{-2\pi i k(2m)/N} \;+\; \sum_{m=0}^{N/2-1} x_{2m+1}\, e^{-2\pi i k(2m+1)/N}."/>
      <p>
        Pull the constant factor <InlineMath tex="e^{-2\pi i k / N}"/> out of the odd sum:
      </p>
      <BlockMath tex="X_k \;=\; \sum_{m=0}^{N/2-1} x_{2m}\, e^{-2\pi i k(2m)/N} \;+\; e^{-2\pi i k/N} \sum_{m=0}^{N/2-1} x_{2m+1}\, e^{-2\pi i k(2m)/N}."/>
      <p>
        Now simplify the inner exponent: <InlineMath tex="e^{-2\pi i k (2m)/N} = e^{-2\pi i km / (N/2)}"/>, which is exactly the discrete probe at frequency <InlineMath tex="k"/> over a window of size <InlineMath tex="N/2"/>. With that substitution, each of the two sums is itself a length-<InlineMath tex="N/2"/> DFT — call them <InlineMath tex="E_k"/> (the DFT of the even-indexed sub-array) and <InlineMath tex="O_k"/> (the DFT of the odd-indexed sub-array):
      </p>
      <BlockMath tex="X_k \;=\; \underbrace{\sum_{m=0}^{N/2-1} x_{2m}\, e^{-2\pi i km/(N/2)}}_{E_k} \;+\; e^{-2\pi i k/N} \underbrace{\sum_{m=0}^{N/2-1} x_{2m+1}\, e^{-2\pi i km/(N/2)}}_{O_k}."/>
      <p>
        That formula gives <InlineMath tex="X_k"/> for <InlineMath tex="k = 0, 1, \dots, N/2 - 1"/>. The remaining outputs <InlineMath tex="X_{k + N/2}"/> come for free from two clean periodicities. Because <InlineMath tex="E_k"/> and <InlineMath tex="O_k"/> are length-<InlineMath tex="N/2"/> DFTs they repeat with period <InlineMath tex="N/2"/>, so <InlineMath tex="E_{k + N/2} = E_k"/> and <InlineMath tex="O_{k + N/2} = O_k"/>. The twiddle factor, on the other hand, flips sign:
      </p>
      <BlockMath tex="e^{-2\pi i (k + N/2)/N} \;=\; e^{-2\pi i k/N} \cdot e^{-\pi i} \;=\; -\, e^{-2\pi i k/N}."/>
      <p>
        Putting these together gives the FFT <em>butterfly</em>:
      </p>
      <BlockMath tex="X_k \;=\; E_k + e^{-2\pi i k/N}\, O_k, \qquad X_{k + N/2} \;=\; E_k - e^{-2\pi i k/N}\, O_k."/>
      <p>
        So one length-<InlineMath tex="N/2"/> DFT of the even-indexed samples, plus one length-<InlineMath tex="N/2"/> DFT of the odd-indexed samples, plus a linear-time combine, gives the entire length-<InlineMath tex="N"/> DFT. The recurrence <InlineMath tex="T(N) = 2T(N/2) + O(N)"/> resolves to <InlineMath tex="O(N \log N)"/>.
      </p>

      <h2>The number-theoretic transform</h2>
      <p>
        Once you start using the FFT for things like polynomial multiplication, floating-point becomes a problem: the values <InlineMath tex="e^{-2\pi i kn/N}"/> are irrational complex numbers, and rounding error accumulates. In competitive programming we usually want an <em>exact</em> answer modulo some prime <InlineMath tex="p"/>. The trick is to notice that the only property of <InlineMath tex="\omega = e^{2\pi i / N}"/> the FFT actually used was a purely algebraic one: <InlineMath tex="\omega^N = 1"/>, with no smaller power of <InlineMath tex="\omega"/> equal to <InlineMath tex="1"/>. Anything with that property — a <em>primitive <InlineMath tex="N"/>-th root of unity</em> — can stand in for it. The <em>Number-Theoretic Transform (NTT)</em> swaps the complex twiddle for an integer <InlineMath tex="\omega \in \mathbb{Z}_p^*"/> with the same defining property.
      </p>
      <p>
        For this to work, <InlineMath tex="\mathbb{Z}_p^*"/> needs to <em>contain</em> a primitive <InlineMath tex="N"/>-th root of unity, which forces <InlineMath tex="N \mid p - 1"/>. The standard trick is to pick a prime of the form <InlineMath tex="p = c \cdot 2^k + 1"/> so that any power-of-two transform length up to <InlineMath tex="2^k"/> is supported. The classic example is <InlineMath tex="p = 998244353 = 119 \cdot 2^{23} + 1"/>, which lets you transform up to length <InlineMath tex="2^{23}"/> with a primitive root <InlineMath tex="3"/>. Same butterflies, same <InlineMath tex="O(N \log N)"/>, but now arithmetic is <em>exact</em> integer arithmetic mod <InlineMath tex="p"/>.
      </p>

      <h2>The convolution theorem</h2>
      <p>
        The discrete convolution of two sequences <InlineMath tex="a_n"/> and <InlineMath tex="b_n"/> is defined as <InlineMath tex="c_k = \sum_{i + j = k} a_i\, b_j"/>. Computing it naively is <InlineMath tex="O(N^2)"/>; the DFT brings it down to <InlineMath tex="O(N \log N)"/> via the <strong>convolution theorem</strong>: the DFT turns convolution into pointwise multiplication. More precisely, if <InlineMath tex="A_k"/> and <InlineMath tex="B_k"/> are the DFTs of <InlineMath tex="a_n"/> and <InlineMath tex="b_n"/>, then the DFT of their convolution is the pointwise product <InlineMath tex="C_k = A_k B_k"/> — a one-line algebraic check. So to compute the convolution: FFT both sequences, multiply pointwise, and inverse-FFT back.
      </p>

      <h2>Applications in competitive programming</h2>
      <p>
        Often in competitive programming, we are interested in the convolution of two sequences, especially in combinatorics problems. Below I will give two different examples of using the convolution theorem to solve problems.
      </p>
      <p>
        <strong>
          <a href="https://codeforces.com/contest/954/problem/I" target="_blank" rel="noopener noreferrer">
            Codeforces 954I — Yet Another String Matching Problem.
          </a>
        </strong>{' '}
        Given strings <InlineMath tex="s"/> and <InlineMath tex="t"/>, the cost of aligning <InlineMath tex="t"/> against the window of <InlineMath tex="s"/> starting at position <InlineMath tex="p"/> is the minimum number of <em>letter-merge</em> operations (each one picks two letters of the alphabet and identifies them everywhere) needed to make the window equal to <InlineMath tex="t"/>. We want this cost for every <InlineMath tex="p"/>.
      </p>
      <p>
        Think of it as a graph problem. Build a 6-node graph <InlineMath tex="G_p"/> whose edges are exactly the unordered letter pairs <InlineMath tex="\{a, b\}"/> that co-occur at alignment <InlineMath tex="p"/> — i.e. some offset <InlineMath tex="i"/> has <InlineMath tex="s_{p+i} = a"/> and <InlineMath tex="t_i = b"/>. The cost at <InlineMath tex="p"/> is the number of merges we need to perform. Each connected component of size <InlineMath tex="\ell"/> needs <InlineMath tex="\ell - 1"/> merges to collapse to a single equivalence class.
      </p>
      <p>
        The bottleneck is detecting, for each <InlineMath tex="p"/>, which ordered pair <InlineMath tex="(a, b)"/> is active. For a fixed pair, define indicator sequences <InlineMath tex="A^{(a)}_i = [s_i = a]"/> and <InlineMath tex="B^{(b)}_i = [t_i = b]"/>. Then "<InlineMath tex="(a, b)"/> is active at alignment <InlineMath tex="p"/>" is exactly the question of whether
      </p>
      <BlockMath tex="\sum_i A^{(a)}_{p+i}\, B^{(b)}_i \;>\; 0,"/>
      <p>
        which is a cross-correlation — equivalent to a convolution after reversing <InlineMath tex="B^{(b)}"/>. One FFT per ordered letter pair gives the active set at every <InlineMath tex="p"/> in <InlineMath tex="O(6^2 \cdot |s| \log |s|)"/>. The remaining work — feeding the active edges into a 6-node union-find for each <InlineMath tex="p"/> — is essentially constant per alignment.
      </p>
      <p>
        <strong>
          <a href="https://atcoder.jp/contests/abc352/tasks/abc352_g" target="_blank" rel="noopener noreferrer">
            AtCoder ABC352G — Socks 3.
          </a>
        </strong>{' '}
        You have <InlineMath tex="A_i"/> socks of colour <InlineMath tex="i"/> for <InlineMath tex="i = 1, \dots, N"/>; total <InlineMath tex="M = \sum_i A_i"/>. You draw socks one at a time without replacement until two of them match. What is the expected number of draws, modulo <InlineMath tex="998244353"/>?
      </p>
      <p>
        Let <InlineMath tex="f(k)"/> be the number of ways to pick a set of <InlineMath tex="k"/> socks <em>all of distinct colours</em>. Dividing by the total number of <InlineMath tex="k"/>-sock subsets turns this into a probability: <InlineMath tex="g(k) = f(k) / \binom{M}{k}"/> is the probability that <InlineMath tex="k"/> socks drawn one-by-one are all of different colours. The probability that the first repeat happens on draw <InlineMath tex="d"/> is then the probability that the first <InlineMath tex="d - 1"/> draws were all of distinct colours but the <InlineMath tex="d"/>-th matches one of them — that is, <InlineMath tex="h(d) = g(d - 1) - g(d)"/>. The expected number of draws is therefore <InlineMath tex="\sum_{d=1}^{M+1} d \cdot h(d)"/>, and the bottleneck is computing <InlineMath tex="f(k)"/> for every <InlineMath tex="k"/>.
      </p>
      <p>
        Suppose we already have <InlineMath tex="f'(k)"/> — the same count but using only the colours <InlineMath tex="1, \dots, N/2"/> — and <InlineMath tex="f''(k)"/> for the colours <InlineMath tex="N/2 + 1, \dots, N"/>. Picking <InlineMath tex="k"/> distinct-coloured socks from all <InlineMath tex="N"/> colours is the same as picking <InlineMath tex="i"/> distinct-coloured socks from the first half and <InlineMath tex="k - i"/> from the second, for some <InlineMath tex="i"/>. That gives the convolution
      </p>
      <BlockMath tex="f(k) = \sum_{i=0}^{k} f'(i)\, f''(k - i)."/>
      <p>
        Both <InlineMath tex="f'"/> and <InlineMath tex="f''"/> can be computed recursively the same way, splitting their colour sets in half again, so we can compute <InlineMath tex="f(k)"/> for all <InlineMath tex="k"/> by divide-and-conquer with an NTT convolution at each merge. The base case is a single colour <InlineMath tex="i"/>, where <InlineMath tex="f(0) = 1"/> and <InlineMath tex="f(1) = A_i"/> (everything else zero). At each level of the recursion the polynomials have total degree at most <InlineMath tex="N"/>, so the convolutions cost <InlineMath tex="O(N \log N)"/> per level; with <InlineMath tex="O(\log N)"/> levels the entire computation runs in <InlineMath tex="O(N \log^2 N)"/>.
      </p>

      <h2>Applications in the real world</h2>
      <p>
        <strong>Image compression.</strong> JPEG runs a 2-D <em>Discrete Cosine Transform</em> on each <InlineMath tex="8 \times 8"/> block of pixels. Most of the energy in a natural image lives in the low-frequency coefficients, so the high-frequency ones can be quantised aggressively (or zeroed out entirely) with little visual loss. That single observation is the core of every JPEG you have ever opened.
      </p>
      <p>
        <strong>State Space Models.</strong> A state space model (SSM) is an architecture under recurrent neural networks (RNN). 
        Continuous SSMs are written as</p>
          <BlockMath tex="\begin{aligned}
          h'(t) &= A h(t) + B x(t), \\
          y(t) &= C h(t) + D x(t),
          \end{aligned}"/>
        <p>
        where <InlineMath tex="h'(t)"/> is the derivative of the hidden state and <InlineMath tex="y(t)"/> is the output, and <InlineMath tex="A, B, C, D"/> are matrices. Discretising with a step size of 1 gives the discrete SSM:
      </p>
      <BlockMath tex="\begin{aligned}
      h_{n+1} &= A h_n + B x_n, \\
      y_n &= C h_n + D x_n.
      \end{aligned}"/>
      <p>
      </p>

      <h2>References</h2>
      <ul>
        <li>
          Cooley, Tukey.{' '}
          <a
            href="https://www.ams.org/journals/mcom/1965-19-090/S0025-5718-1965-0178586-1/"
            target="_blank"
            rel="noopener noreferrer"
          >
            An Algorithm for the Machine Calculation of Complex Fourier Series
          </a>
          , Math. Comp. 19 (1965), 297–301 — the original FFT paper.
        </li>
        <li>
          <a
            href="https://cp-algorithms.com/algebra/fft.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Fast Fourier Transform
          </a>{' '}
          on cp-algorithms.com — the canonical reference for the contest implementation, including NTT.
        </li>
        <li>
          3Blue1Brown.{' '}
          <a
            href="https://www.youtube.com/watch?v=spUNpyF58BY"
            target="_blank"
            rel="noopener noreferrer"
          >
            But what is the Fourier Transform? A visual introduction
          </a>{' '}
          — the best 20-minute build of the intuition the integral formula tries to express.
        </li>
        <li>
          <a
            href="https://www.cl.cam.ac.uk/teaching/2526/DSP/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Digital Signal Processing
          </a>
          , University of Cambridge Part II course (2025–26) — the lecture course where I first met the DFT in earnest.
        </li>
      </ul>
    </article>
  );
}
