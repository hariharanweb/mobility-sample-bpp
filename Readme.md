## Mobility ONDC BPP

- Add these entries to `/etc/hosts`
```
127.0.0.1 mobility-sample-bap
127.0.0.1 sample-gateway-registry
127.0.0.1 mobility-sample-bpp
```
- This is sample mobility BPP
- Runs on http://mobility-sample-bpp:3010

## Running BPP locally

- Copy `local.env` to `.env` 
- Run `yarn start`
- To run in watch mode `yarn run watch`

## Running BPP as Docker

- Build image `docker build -t mobility-sample-bpp:latest .`
- Run the container `docker run -p 3010:3010 --name mobility-sample-bpp -d mobility-sample-bpp:latest`
- Check the logs `docker logs -f mobility-sample-bpp`
