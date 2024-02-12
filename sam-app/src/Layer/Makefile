build-Layer:
	npm run clean # Clean the environment
	npm install   # Install our Dependencies
	npm run build # Build our package // Layer

	# Create our Package Directory
	mkdir -p "$(ARTIFACTS_DIR)/nodejs/node_modules/layer"

	# Copy our built code + package.json to our Directory
	cp -r dist package.json "$(ARTIFACTS_DIR)/nodejs/node_modules/layer"