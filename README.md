# deploy-branch
Github pages for third party hosting providers


Do you have a branch on your github repo that you want to deploy?
Maybe you have a "docs" branch that you want to host for free?
"deploy-branch" is a simple github action that will automatically deploy your desired branch to a hosting provider on every commit.

## Available Providers
- [x] Netlify
- [ ] Zeit Now (coming soon)
- [ ] Surge.sh (coming soon)

## Setup
### Setup with Netlfiy
#### 1 - Generate a netlify auth token
- https://app.netlify.com/user/applications/personal
- Store the generated auth token as a github secret named NETLIFY_AUTH_TOKEN
- http://github.com/_your_repo_here_ `Settings tab -> Secrets -> Add new secret`
#### 2 - Generate a netlify site id
In order to generate a netlify site id, we must run `npx netlify-cli init --manual`. Below you will find an example run, and the outputted side-id marked **SITE ID**. This site id will be required in the next step
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
#### 3 - Update your workflow
* Assuming the branch you would like to deploy is named "docs"
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
You will now see the deployment information in your action logs, as well as a comment on the individual commit with the deployment information.
Note, the github-token input is only required to add the commit comment. If you do not feel comfortable handing out the github token, you can simply remove it and it will still deploy the site but will not comment the deployment information on your commit.



