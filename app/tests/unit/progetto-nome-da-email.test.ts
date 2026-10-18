// Il nome ricavato dall'email: casi che si ricavano, casi che no.
import test from 'node:test';
import assert from 'node:assert/strict';
import { nomeDaEmail } from '../../src/lib/progetto/nomeDaEmail';

test('nome.cognome: iniziali maiuscole', () => {
  assert.deepEqual(nomeDaEmail('mario.rossi@mail.polimi.it'), { nome: 'Mario Rossi', parti: ['Mario', 'Rossi'] });
  assert.equal(nomeDaEmail('MARIO.ROSSI@POLIMI.IT')?.nome, 'Mario Rossi');
  assert.equal(nomeDaEmail('  mario.rossi@dei.polimi.it ')?.nome, 'Mario Rossi');
});

test('nomi composti: si mostra tutto, nell\'ordine dell\'indirizzo', () => {
  const r = nomeDaEmail('anna.maria.bianchi@mail.polimi.it')!;
  assert.equal(r.nome, 'Anna Maria Bianchi');
  assert.equal(r.parti.length, 3);
  assert.equal(nomeDaEmail('maria-chiara.de.luca@mail.polimi.it')?.nome, 'Maria-Chiara De Luca');
  assert.equal(nomeDaEmail("giulia.d'arco@mail.polimi.it")?.nome, "Giulia D'Arco");
});

test('cifre e etichette: si tolgono', () => {
  assert.equal(nomeDaEmail('mario.rossi2@mail.polimi.it')?.nome, 'Mario Rossi');
  assert.equal(nomeDaEmail('mario.rossi.10@mail.polimi.it')?.nome, 'Mario Rossi');
  assert.equal(nomeDaEmail('mario.rossi+prova@mail.polimi.it')?.nome, 'Mario Rossi');
  assert.equal(nomeDaEmail('mario_rossi@mail.polimi.it')?.nome, 'Mario Rossi');
  assert.equal(nomeDaEmail('mario..rossi@mail.polimi.it')?.nome, 'Mario Rossi');
});

test('non ricavabile: matricola, una sola parola, iniziali, simboli, vuoto', () => {
  for (const e of ['10501234@polimi.it', 'mrossi@mail.polimi.it', 'mario@polimi.it', 'm.rossi@mail.polimi.it', 'mario.r@mail.polimi.it', '1050.1234@polimi.it', '', '@polimi.it', 'mario.ros%si@polimi.it', 'mario.-rossi@polimi.it']) {
    assert.equal(nomeDaEmail(e), null, e);
  }
  assert.equal(nomeDaEmail(undefined as unknown as string), null);
});
