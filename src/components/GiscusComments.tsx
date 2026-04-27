import Giscus from '@giscus/react';

export default function GiscusComments() {
  return (
    <div className="giscus-wrapper">
      <Giscus
        repo="andyzhu23/andyzhu23.github.io"
        repoId="R_kgDONrT4Mg"
        category="General"
        categoryId="DIC_kwDONrT4Ms4C7zJS"
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme="dark"
        lang="en"
        loading="lazy"
      />
    </div>
  );
}
