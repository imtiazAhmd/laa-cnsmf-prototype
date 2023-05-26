apiVersion: apps/v1
kind: Deployment
metadata:
  name: laa-claim-non-standard-magistrate-fee-high-fidelity-prototype
spec:
  replicas: 1
  selector:
    matchLabels:
      app: laa-claim-non-standard-magistrate-fee-high-fidelity-prototype
  template:
    metadata:
      labels:
        app: laa-claim-non-standard-magistrate-fee-high-fidelity-prototype
    spec:
      containers:
      - name: ubidemo
        image: ${ECR_URL}:${IMAGE_TAG}
        ports:
        - containerPort: 5000

