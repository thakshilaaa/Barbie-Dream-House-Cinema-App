const { spawn } = require('child_process');
const path = require('path');

const root = __dirname;
const server = spawn('npm', ['--prefix', path.join(root, 'server'), 'start'], {
  cwd: root,
  shell: true,
  stdio: 'inherit'
});

const client = spawn('npm', ['--prefix', path.join(root, 'client'), 'run', 'dev', '--', '--host', '0.0.0.0'], {
  cwd: root,
  shell: true,
  stdio: 'inherit'
});

server.on('exit', (code) => {
  if (code !== 0) process.exit(code);
});

client.on('exit', (code) => {
  if (code !== 0) process.exit(code);
});
