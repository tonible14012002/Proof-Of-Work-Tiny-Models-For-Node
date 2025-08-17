
PROD_REPO=git@github.com:tonible14012002/Proof-Of-Work-Tiny-Models-For-Node.git
RELEASE_BRANCH=main
DEVELOP_BRANCH=dev
BETA_BRANCH=dev

setup-repo:
	@git remote add prod $(PROD_REPO) \

.PHONY: release
release: sync-release
	git checkout $(BETA_BRANCH) && git pull origin $(BETA_BRANCH) && \
		git checkout $(RELEASE_BRANCH) && git pull origin $(RELEASE_BRANCH) && \
		git merge $(BETA_BRANCH) --no-edit --no-ff && \
		git push origin $(RELEASE_BRANCH) && \
		git push $(PROD_REPO) $(RELEASE_BRANCH) && \
		git checkout $(DEVELOP_BRANCH) && git push origin $(DEVELOP_BRANCH)

.PHONY: sync-release
sync-release:
	git checkout $(RELEASE_BRANCH) && git pull origin $(RELEASE_BRANCH) && \
		git checkout $(BETA_BRANCH) && git pull origin $(BETA_BRANCH) && \
		git merge $(RELEASE_BRANCH) --no-edit --no-ff