import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const localDist = path.resolve(process.cwd(), 'dist');
const pemPath = '/Users/akino/Documents/serverKey/hyphotos.pem';
const remoteUser = 'ubuntu';
const remoteHost = '123.206.219.194'
const remoteDir = '/home/ubuntu/www/exif';

function run(cmd) {
  console.log(`\n$ ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

if (!fs.existsSync(localDist) || !fs.statSync(localDist).isDirectory()) {
  console.error(`未找到本地目录: ${localDist}`);
  process.exit(1);
}

if (!fs.existsSync(pemPath)) {
  console.error(`未找到密钥文件: ${pemPath}`);
  process.exit(1);
}

if (!remoteHost || remoteHost.includes('请填写')) {
  console.error('请先设置服务器地址，例如：DEPLOY_HOST=1.2.3.4 node output/deploy-exif.js');
  process.exit(1);
}

const sshBase = `ssh -i \"${pemPath}\" -o StrictHostKeyChecking=no ${remoteUser}@${remoteHost}`;
const scpBase = `scp -i \"${pemPath}\" -o StrictHostKeyChecking=no -r`;

try {
  run(`${sshBase} 'mkdir -p ${remoteDir} && find ${remoteDir} -mindepth 1 -maxdepth 1 -exec rm -rf {} +'`);
  run(`${scpBase} \"${localDist}/.\" ${remoteUser}@${remoteHost}:${remoteDir}/`);
  console.log('\n部署完成。');
} catch (error) {
  console.error('\n部署失败，请检查服务器地址、密钥权限、SSH 连通性。');
  process.exit(1);
}
