docker network inspect ondc-network --format {{.Id}} 2>/dev/null || docker network create ondc-network
docker build -t mobility-sample-bpp:latest .
docker stop mobility-sample-bpp || true && docker rm mobility-sample-bpp || true
docker run --network=ondc-network -p 3010:3010 --name mobility-sample-bpp --env-file docker.env -d mobility-sample-bpp:latest 