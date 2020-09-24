## Major Map Initiative

Major Map Initiative - Development branch is the rolling release of the Major Map Initiative website. This rolling release is for internal members developing and testing new features and improvements.

This version is intended for developers and designers and is absolutely, 100% NOT recommended for daily use. Rolling releases are not subject to the rigorous testing of the regular production release.

## How to Contribute

### Creating a Fork

From the repo click the "Fork" button. Next, use your favorite git client or command line to clone the repo:

```shell
# Clone your fork to your local machine
```

### Keeping Your Fork Up to Date
You'll want to make sure you keep your fork up to date by tracking the original "upstream" repo that you forked. To do this, you'll need to add a remote:

```shell
# Add 'upstream' repo to list of remotes
git remote add upstream "https://github.com/Major-Map-Initiative/Website.git"
```

Whenever you want to update your fork with the latest upstream changes, you'll need to first fetch the upstream repo's branches and latest commits to bring them into your repository:
```shell
# Fetch from upstream remote
git fetch upstream
```

Now you are ready to checkout your local `development` branch and merge in any changes from the upstream repo's `development` branch:
```shell
# Checkout your master branch and merge upstream
git checkout development
git merge upstream/development
```

Your local `development` branch is now up-to-date with any changes upstream.

### Doing Your Work


#### Create a Feature Branch
When you begin working on a new feature or bugfix, it is important that you create a new branch. Not only is it proper git workflow, but it also keeps your changes organized and separated from the `development` branch so that you can easily submit and manage multiple pull requests for every task you complete.

To create a new branch and start working on it:

```shell
# Checkout the development branch
git checkout development

# Create and checkout a branch named newfeature
git checkout -b newfeature
```

You are now ready to begin developing your new feature. Commit your code often, using present-tense and concise verbiage explaining the work completed.

Example: Add, commit, and push your new feature:
```shell
# Show the state of staged and unstaged files you created or updated
git status

# Add files to include in your newfeature
git add <path to file>

# Commit your code
git commit -m "message"

# Push your code
git push -u origin newfeature

```


### Submitting a Pull Request

#### Update your feature branch
 Prior to submitting a pull request, update your `newfeature` branch from `upstream/development` so that merging it will be a simple process which won't require any conflict resolution work.
```shell
# Fetch upstream development and merge with your local development branch
git fetch upstream
git checkout development
git merge upstream/development

# If there were any new commits, merge them from `development` and update your branch
git checkout newfeature
git merge development
git push origin newfeature
```


#### Submitting
Once you've committed and pushed your feature branch `newfeature` to GitHub, go to the page for your fork on GitHub, select branch 'newfeature' and click the 'New pull request' button.

If you need to make future updates to your pull request, push the updates to your feature branch `newfeature` on GitHub. Your pull request will automatically track the changes on your feature branch and update.










