import { InlineMath } from '../../components/Math';
import type { BlogPostMeta } from './types';

export const meta: BlogPostMeta = {
  slug: 'cambridge-undergrad',
  title: 'Three years at Cambridge: what I learned reading the Computer Science Tripos',
  date: 'June 11, 2026',
  description:
    'A reflection on my undergraduate experience reading the Computer Science Tripos at Cambridge.',
  tags: ['cambridge', 'university', 'reflection'],
  readingMinutes: 5,
};

export default function CambridgeUndergradPost() {
  return (
    <article className="blog-article">
      <p className="blog-lead">
        I recently finished my third-year exams, bringing an end to my undergraduate journey at Cambridge. It's been a transformative experience, and I want to take some time to reflect on the highs and lows of the past three years, and the lessons I've learned. This post is a collection of thoughts and advice for anyone considering or currently undertaking the Computer Science Tripos at Cambridge.
      </p>

      <h2>Before Cambridge</h2>
      <p>
        Thinking back now, my Cambridge experience actually started a year before I set foot on campus for the first time. Back in the fall of 2022, I wasn't initially planning to apply to universities in the UK, as it wasn't a popular choice among my peers in high school. Most people there were aiming for top US universities instead, and my dream back then was to attend CMU or UC Berkeley. The initial reason I started applying to UK universities was peer pressure. My high school in Canada was quite a sweaty place when it came to university applications, and I felt like I had to apply to UK universities just because so many of my peers were doing so. At the time, I had no vision of myself attending Cambridge — I thought it was too prestigious and competitive for someone like me.
      </p>
      <p>
        Let's just say I was very wrong about that. I was rejected by pretty much every US university I applied to. On the other hand, I received an offer from Cambridge in January 2023. That offer came with a hard condition, though — I had to achieve 5s on all my AP exams, the most daunting of them all being AP World History. The second half of my senior year was, let's just say, quite stressful. Since there's no such thing as a conditional offer in the US, all my peers were just chilling and enjoying their final year while I was cramming for AP exams. I remember spending countless hours studying and practicing, and it was definitely not a fun experience. But I'm glad I went through it, because it taught me a lot about discipline and perseverance — traits that would serve me well at Cambridge. It also made me appreciate the opportunity even more, knowing how hard I'd had to work to get there.
      </p>

      <h2>Initial experiences</h2>
      <p>
        It was a time when I was still young and naive, and didn't know that <InlineMath tex='\neg\neg A'/> does not imply <InlineMath tex='A'/> in Types. The first day I set foot in a lecture, I knew I had stepped into a completely different world. In high school, I was used to being one of the top students in my class for STEM subjects, and everything came easily. But in my first year at Cambridge, I met so many IOI and IMO medallists that I was embarrassed to even admit I was interested in competitive programming, having never made the Canadian IOI team.
      </p>
      <p>
        Strangely, it felt like I had returned to my Chinese elementary school days, where all my classmates were smart and capable and I was the odd one out. But since I'd been in this kind of situation before, I knew I could use it as an opportunity to learn from my peers and improve. I started making friends from all around the globe, each brilliant in their own way. I also began to realize that there are many different ways to be smart, and that being good at competitive programming is just one of them. I learned to appreciate the diversity of talents around me, and to value my own strengths and weaknesses.
      </p>
      <p>
        The biggest lesson I learned in my first year was actually self-control. Contrary to popular belief, I found the workload at Cambridge to be light, because we have almost no coursework that counts for marks — it's just one massive exam at the end of the year. I initially struggled in this environment, because I was used to being told what to do and when to do it in high school. At Cambridge, I was simply told there was a massive exam at the end of the year, and it was up to me to figure out how to prepare for it.
      </p>

      <h2>On the assessment system</h2>
      <p>
        Coming from Canada, I initially thought the idea of one massive end-of-year exam was ridiculous — too stressful, and not an accurate reflection of my abilities. The fact that first- and second-year exams don't even count toward my final mark confused me even more about how to approach my studies. Looking back now, I actually think the system is quite good. In first and second year, I was able to explore different ways of studying without the stakes of maintaining a GPA. I found out what worked and what didn't, and I learned how to learn. In high school, I'd been under constant pressure to maintain a high GPA, to the point that I was learning for the grade and not because the material was interesting. At Cambridge, I was able to learn for the sake of learning, and that was a liberating experience. I learned how to manage my time and prioritize my studies — a skill I'll carry with me for the rest of my life.
      </p>
      <p>
        I'd read a lot about UK versus US universities when it came to studying a subject. The popular belief is that US universities provide a broad experience and let students explore different subjects, while UK universities offer a more focused, in-depth experience in a single subject. I agree with this generalization across subjects, since I couldn't formally take any courses outside my Computer Science Tripos. However, I think Cambridge provides a wider computer science experience within the subject itself than US universities do. Cambridge forces you to take every course in your Tripos in first and second year, and only opens up a little room for specialization in third year. If I'd been given the choice, I probably wouldn't have picked courses like Computer Architecture, Operating Systems, Computer Networks, or Graphics, because I didn't think they were interesting. But I later realized those courses were extremely useful in industry, and they helped me understand how my code interacts with the hardware in ways I never knew before. The Tripos system is quite unique, and it gives students a great opportunity to learn and grow in their own way.
      </p>

      <h2>The exams</h2>
      <p>
        The exams at Cambridge are quite different from what I was used to in high school. There, my goal on every exam was simply to not make silly mistakes and to get a perfect score. The content posed no challenge; it was just about execution. This limited experience with genuinely challenging exams left me quite unprepared for Cambridge.
      </p>
      <p>
        A Cambridge exam consists of around 10 questions, of which I only have to answer 5. They're essay-style questions, designed not to repeat from previous years, and most of them require real understanding of the subject to answer. I initially relied on memorizing the content, thinking that would be enough to do well. I quickly realized it wasn't, because the questions were designed to test my understanding, not my ability to regurgitate information. I had to learn how to apply the concepts from lectures to new and unfamiliar problems — a challenging but rewarding experience. I also learned how to manage my time during the exam, since I had to answer 5 questions in 3 hours, which meant about 30 minutes per question.
      </p>

      <h2>Criticisms of the system</h2>
      <p>
        I think the worst aspect of Cambridge is the lack of practical experience. The degree is built almost entirely around lectures and exams, with very little coursework where students apply what they've learned in a hands-on way. There are projects — the Part IB group project and the Part II dissertation — but they aren't tied to the content of the lectures, so they don't provide the same kind of practical reinforcement that a coursework-based system would. This is especially true for the systems courses: I think it would be very beneficial for students to get hands-on experience building and deploying systems, since that's what they'll be doing in industry. I've heard that Waterloo in Canada and Imperial in the UK both have excellent coursework that gives students practical experience, and I wish Cambridge would implement something similar. After my systems courses, I still only had a theoretical understanding of how operating systems, computer networks, and computer architecture work, and I had no idea how to build something using those concepts. I think this is a major drawback of the Cambridge system, and I hope they consider adding more practical components in the future.
      </p>
      <p>
        A second issue is the supervision system. Supervisions are small-group sessions where students meet with a supervisor (often a PhD student or postdoc) to discuss the material from lectures and go through problem sheets. This is often praised as a unique and valuable aspect of the Cambridge experience, but I found it to be quite hit-or-miss. Some supervisors are excellent and really help students understand the material, while others are less effective and can even be detrimental to the learning experience. In my experience, a lot of this comes down to the fact that many supervisors didn't do their undergrad at Cambridge, so they haven't taken the same courses as the students they're supervising. This means they may not be familiar with the specific content and style of the lectures, which can lead to confusion and frustration for students. I honestly think the TA system used in US universities is more effective, since TAs are usually students who have taken the same courses and can provide more relevant and targeted support to their peers. I hope Cambridge considers reforming the supervision system to ensure that all supervisors are well-equipped to support their students effectively.
      </p>
      <p>
        A final issue is that Cambridge places too much focus on the theoretical side of computer science. We have a lot of courses on the semantics of programming languages, and a heavy emphasis on OCaml.
      </p>

      <h2>Social life</h2>
      <p>
        When it came to societies, I kept things simple — I really only attended the bridge club and the competitive programming society. Both were a great social outlet and let me meet people with similar interests. I actually picked up bridge in my first year, when a mathmo (maths student) in my college needed a partner for the weekly session. I had no experience with bridge before, but I thought it would be a fun way to meet new people and learn a new skill, so I gave it a try. I struggled a lot at first — my partner and I came last every session for eight weeks straight. But slowly, I got the hang of the bidding conventions and card play, and I started to enjoy the game more and more. I made a lot of friends in the bridge club, and I found that playing bridge was a great way to relax and unwind after a long day of studying — a nice balance to my academic life.
      </p>

      <h2>What comes next</h2>
      <p>
        I'm staying at Cambridge to pursue the integrated master's, which means another year of study for a fourth year. After that, I'll probably go into industry for a few years before considering graduate school. I'm not sure exactly what I want to do in the future, but I'm excited to explore different opportunities and see where my degree takes me. I'm also grateful for the experiences and lessons I've gathered during my time at Cambridge, and I'll carry them with me as I move forward.
      </p>
    </article>
  );
}
