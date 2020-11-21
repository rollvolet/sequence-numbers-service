import { app, errorHandler, uuid } from 'mu';
import { querySudo as query } from '@lblod/mu-auth-sudo';
import { waitForDatabase } from './support/database-utils';

let sequenceNumber = 0;

waitForDatabase(async () => {
  await initializeSequenceNumber();
});

app.post('/sequence-numbers', function(req, res) {
  if (sequenceNumber > 0)
    sequenceNumber = sequenceNumber + 1;

  res.status(200).send({
    data: {
      type: 'sequence-number',
      id: uuid(),
      attributes: {
        value: sequenceNumber
      }
    }
  });
});

app.post('/reset', async function(req, res) {
  await initializeSequenceNumber();
  res.status(204).end();
});

async function initializeSequenceNumber() {
  const result = await query(`
    PREFIX gr: <http://purl.org/goodrelations/v1#>
    PREFIX dct: <http://purl.org/dc/terms/>
    SELECT ?number
    WHERE {
      GRAPH ?g {
        ?product a gr:SomeItems ;
                 dct:identifier ?number .
      }
    } ORDER BY DESC(?number) LIMIT 1
  `);

  if (result.results.bindings.length) {
    sequenceNumber = parseInt(result.results.bindings[0]['number'].value);
  } else {
    sequenceNumber = 0;
  }
}

app.use(errorHandler);
