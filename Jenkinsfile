pipeline {
	agent {
		kubernetes {
			yaml '''
apiVersion: v1
kind: Pod
spec:
    containers:
    - name: node
      image: node:20-slim
      command:
        - sleep
      args:
        - infinity
'''
			defaultContainer 'node'
		}
	}

	stages {
		stage('test') {
			steps {
				dir('mfe/Freetext') {
					sh 'corepack enable'
					sh 'yes | pnpm install'
					sh 'pnpm test'
				}
			}
		}
	}
}
