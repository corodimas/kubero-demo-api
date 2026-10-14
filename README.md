# kubero-demo-api

A tiny Express API deployed on the Kubero PoC (GKE sandbox, `pkg-ssc-sandbox-dev`).

**Live at:** http://demo-api.34.15.170.152.nip.io

## Routes

| Route | Description |
|---|---|
| `GET /` | Service info |
| `GET /api/hello?name=You` | Greeting |
| `GET /api/time` | Server time (ISO) |
| `POST /api/echo` | Echoes the JSON body |

## How it deploys

Kubero builds from git with Cloud Native Buildpacks — no Dockerfile needed:

1. Push a commit to `main` on this repo.
2. A `KuberoBuild` run clones the repo, runs `npm install` in `node:latest`, and pushes the image to Artifact Registry (`.../kubero/sandbox-demo-api`).
3. The `demo-api` deployment picks up the image and the app serves at `demo-api.<ingress-ip>.nip.io`.

## Redeploy after changing code

**Easiest — via the Kubero UI:** open the Kubero UI, open pipeline **sandbox** → app **demo-api** → **Deploy**.

**Or via kubectl:**

```bash
git push                                     # your code change
gcloud container clusters get-credentials scgp-sandbox-kubero --region asia-southeast3-a --project pkg-ssc-sandbox-dev

# new build id each time (job names are immutable)
sed -i "s/id: \".*\"/id: \"$(date +%Y%m%d-%H%M)\"/" kuberobuild.yaml
kubectl delete kuberobuild demo-api-build-1 -n sandbox-production
kubectl apply -f kuberobuild.yaml
kubectl get pods -n sandbox-production -w     # watch fetch -> build -> push
```

The build pushes the image and the deployment rolls to it automatically.

## Files

- `index.js` / `package.json` — the app (Express, listens on `$PORT` or 3000)
- `kuberoapp.yaml` — the Kubero app definition (git source, buildpack, image destination, ingress)
- `kuberobuild.yaml` — the build trigger (clone → buildpack build → push)
