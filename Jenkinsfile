pipeline {
	agent {
		kubernetes {
		yaml '''
apiVersion: v1
kind: Pod
spec:
    container:
    - name: node
      image: node:20-slim
      command:
        - "sleep"
      args:
        - "infinity"
'''
			defaultContainer 'node'
		}
	}

	stages {
		stage('test') {
			steps {
                sh 'corepack enable'
                sh 'cd mfe/Freetext'
                sh 'yes | pnpm install'
                sh 'pnpm test'
			}
		}
	}
}
