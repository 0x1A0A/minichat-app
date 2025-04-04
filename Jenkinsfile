pipeline {
	agent {
		kubernetes {
			containerTemplate {
				name 'node'
				image 'node:20-slim'
				command 'sleep'
				args 'infinity'
			}
			defaultContainer 'node'
		}
	}

	stages {
		stage('test') {
			steps {
				container('node') [
					sh 'ls'
					sh 'node -v'
			}
		}
	}
}
