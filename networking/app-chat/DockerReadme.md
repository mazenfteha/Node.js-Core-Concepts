## to build image
>docker build -t chat-app .

## to run container  
> docker run -p 3008:3008 -d chat-app  

## to stop and remove a running container 
> docker rm -f container-id

### K8s
## to create deployment
> kubectl apply -f deployment.yaml

## to create service
> kubectl apply -f service.yaml