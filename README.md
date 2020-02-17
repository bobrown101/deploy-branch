# deploy-branch
"bobrown101/deploy-branch" is a github action that will deploy a single branch of your github repository to the request provider
If the optional "github-token" input is provided, it will also comment on the commit that triggered the build with the deployment information.

## Available Providers
- [x] Netlify
- [] Zeit Now (coming soon)
- [] Surge.sh (coming soon)

## Setup
### Setup with Netlfiy
#### Generate a netlify auth token
- https://app.netlify.com/user/applications/personal
- Store the generated auth token as a secret named NETLIFY_AUTH_TOKEN
- Settings tab -> Secrets -> Add new secret
#### Generate a netlify site id
In order to generate a site-id, we must run `npx netlify-cli init --manual`. Below you will find an example run, and the site id mared **SITE ID**. This id will be required in the next step
```
npx netlify-cli init --manual
? Do you want to create a Netlify site without a git repository? Yes, create and deploy site manually
? Team: Brady Brown's team
Choose a unique site name? Site name (optional): YourSiteName

Site Created

Admin URL: https://app.netlify.com/sites/YourSiteName
URL:       https://YourSiteName.netlify.com
Site ID:   **SITE ID**
"YourSiteName" site was created

To deploy to this site. Run your site build and then netlify deploy
```
#### Updating your workflow
* Assuming the branch you would like to deploy is "docs"
Add the following to your .github/workflows/*.yml file

```
- name: Deploy docs
  uses: bobrown101/deploy-branch@v2.0.0
  with:
    provider: NETLIFY
    netlify-auth-token: ${{ secrets.NETLIFY_AUTH_TOKEN }}
    netlify-site-id: <**INSERT_SITE_ID_HERE**>
    branch: docs
    github-token: ${{ secrets.GITHUB_TOKEN }}
```



