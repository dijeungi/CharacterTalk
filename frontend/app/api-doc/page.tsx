import { getApiDocs } from '../lib/swagger';
import ReactSwagger from '../_components/ReactSwagger';

export default async function ApiDocPage() {
  const spec = await getApiDocs();

  return (
    <section style={{ padding: '2rem' }}>
      <ReactSwagger spec={spec} />
    </section>
  );
}
