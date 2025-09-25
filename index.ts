import { serve } from 'bun';
import type { ProgrammingLanguage } from './src/ProgrammingLanguage';
const PORT = 6989;

let programmingLanguages: ProgrammingLanguage[] = []

function handleGetProgrammingLanguages() {
  return new Response(JSON.stringify(programmingLanguages), { headers: { 'Content-Type': 'application/json' } })
}

function handleGetProgrammingLanguagesById(id: number) {
  const programmingLanguage = programmingLanguages.find((programmingLanguage) => programmingLanguage.idProgrammingLanguage === id);
  if (programmingLanguage) {
    return new Response(JSON.stringify(programmingLanguage), { headers: { 'Content-Type': 'application/json' } });
  }
  return new Response('Not Found', { status: 404 });
}

function handleCreateProgrammingLanguage(name: string, yearCreated: number) {
  const programmingLanguage: ProgrammingLanguage = {
    idProgrammingLanguage: programmingLanguages.length + 1,
    name: name,
    yearOfCreation: yearCreated,
  }

  programmingLanguages.push(programmingLanguage);

  return new Response(JSON.stringify(programmingLanguage), {
    headers: { 'Content-Type': 'application/json' },
    status: 201,
  });
}

function handleUpdateProgrammingLanguage(id: number, name: string, yearCreated: number) {
  const index = programmingLanguages.findIndex((programmingLanguage) => programmingLanguage.idProgrammingLanguage === id);

  if (index === -1) {
    return new Response('Programming Language No Found', { status: 404 });
  }

  programmingLanguages[index] = {
    ...programmingLanguages[index],
    name: name,
    yearOfCreation: yearCreated,
  }

  return new Response('Programming Language Updated', { status: 200 });
}

function handleDeleteProgrammingLanguage(id: number) {
  const index = programmingLanguages.findIndex((programmingLanguage) => programmingLanguage.idProgrammingLanguage === id);

  if (index !== -1) {
    programmingLanguages.splice(index, 1);
    return new Response('Programming Language Deleted', { status: 200 });
  }

  return new Response('Not Found', { status: 404 });
}
serve({
  port: PORT,
  async fetch(request: Request) {
    const { method } = request;
    const { pathname } = new URL(request.url);
    const pathRegexForID = /^\/api\/programmingLanguages\/(\d+)$/;

    if (method === 'GET' && pathname === '/api/programmingLanguages') {
      return handleGetProgrammingLanguages();
    }

    if (method === 'GET') {
      const match = pathname.match(pathRegexForID);
      const id = Number(match && match[1]);
      if (id) {
        return handleGetProgrammingLanguagesById(id);
      }
    }

    if (method === 'POST' && pathname === '/api/programmingLanguages') {
      const newProgrammingLanguage = await request.json() as ProgrammingLanguage;
      return handleCreateProgrammingLanguage(newProgrammingLanguage.name, newProgrammingLanguage.yearOfCreation);
    }

    if (method === 'PATCH') {
      const match = pathname.match(pathRegexForID);
      const id = Number(match && match[1]);
      if (id) {
        const updatedProgrammingLanguage = await request.json() as ProgrammingLanguage;
        return handleUpdateProgrammingLanguage(id, updatedProgrammingLanguage.name, updatedProgrammingLanguage.yearOfCreation);
      }
    }

    if (method === 'DELETE') {
      const match = pathname.match(pathRegexForID);
      const id = Number(match && match[1]);
      if (id) {
        return handleDeleteProgrammingLanguage(id);
      }
    }
    return new Response('Not Found', { status: 404 });
  },
});
console.log(`Listening on http://localhost:${PORT} ...`);