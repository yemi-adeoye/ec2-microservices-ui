/* groovylint-disable CompileStatic, FactoryMethodName, MethodReturnTypeRequired, NoDef */
def copyFiles() {
  echo 'Copying files to EC2'
  sh 'sshpass -p ${LOCAL_EC2_PASSWORD} scp -o StrictHostKeyChecking=no -r ./src ${USER}@${LOCALHOST}:/${API_GATEWAY_DIR}/'
  sh 'sshpass -p ${LOCAL_EC2_PASSWORD} scp -o StrictHostKeyChecking=no  ./package.json ${USER}@${LOCALHOST}:/${API_GATEWAY_DIR}/'
}

def installPackages() {
  echo 'Installing Packages'
  sh '''sshpass -p ${LOCAL_EC2_PASSWORD} ssh -o StrictHostKeyChecking=no ${USER}@${LOCALHOST} "cd /${API_GATEWAY_DIR}; npm install" '''
}

def runService() {
  echo 'Running api-gateway microservice'
  sh '''nohup sshpass -p ${LOCAL_EC2_PASSWORD} ssh -o StrictHostKeyChecking=no ${USER}@${LOCALHOST} "cd /${API_GATEWAY_DIR}; npm start" '''
}

return this
