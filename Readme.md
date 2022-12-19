## Mobility ONDC BPP

- This is sample mobility BPP
- Runs on http://localhost:3010

## Running BPP locally

- Copy `local.env` to `.env` 
- Run `npm start`
- To run in watch mode `npm run watch`

## Running BPP as Docker

- Build image `docker build -t mobility-sample-bpp:latest .`
- Run the container `docker run -p 3010:3010 --name mobility-sample-bpp -d mobility-sample-bpp:latest`
- Check the logs `docker logs -f mobility-sample-bpp`
