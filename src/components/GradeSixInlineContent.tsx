import type { GradeSixSectionContent } from '../lib/grade-six-content';

export function GradeSixInlineContent({ content }: { content: GradeSixSectionContent }) {
  return (
    <article className="grade-six-inline-content">
      <h2>{content.heading}</h2>
      {content.subtitle && <p className="grade-six-inline-content__subtitle">{content.subtitle}</p>}
      <div className="grade-six-inline-content__blocks">
        {content.blocks.map((block, index) => (
          <section className="grade-six-inline-content__block" key={`${index}-${block.title}`}>
            <h3>{block.title}</h3>
            {block.type === 'paragraph' ? (
              <p>{block.text}</p>
            ) : block.type === 'table' ? (
              <div className="grade-six-inline-content__table-wrap">
                <table>
                  <thead><tr>{block.columns.map((column) => <th scope="col" key={column}>{column}</th>)}</tr></thead>
                  <tbody>{block.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, i) => <td key={i}>{cell}</td>)}</tr>)}</tbody>
                </table>
              </div>
            ) : block.type === 'ordered-list' ? (
              <ol>{block.items.map((item) => <li key={item}>{item}</li>)}</ol>
            ) : (
              <ul>{block.items.map((item) => <li key={item}>{item}</li>)}</ul>
            )}
          </section>
        ))}
      </div>
      {content.examFocus && content.examFocus.length > 0 && (
        <aside className="grade-six-inline-content__exam" aria-label="أهم ما يراجع قبل الامتحان">
          <h3>🎯 ركّز عليها قبل الامتحان</h3>
          <ol>{content.examFocus.map((item) => <li key={item}>{item}</li>)}</ol>
        </aside>
      )}
    </article>
  );
}
