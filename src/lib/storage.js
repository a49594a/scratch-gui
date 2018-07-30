import ScratchStorage from 'scratch-storage';

import defaultProjectAssets from './default-project';

//by yj
//const PROJECT_SERVER = 'https://cdn.projects.scratch.mit.edu';
//const ASSET_SERVER = 'https://cdn.assets.scratch.mit.edu';
const PROJECT_SERVER = Blockey.PROJECT_SERVER;//'http://localhost:32265/';
const ASSET_SERVER = Blockey.ASSET_SERVER;//'http://localhost:32265/';

/**
 * Wrapper for ScratchStorage which adds default web sources.
 * @todo make this more configurable
 */
class Storage extends ScratchStorage {
    constructor () {
        super();
        this.addWebSource(
            [this.AssetType.Project],
            projectAsset => {
                const [projectId, revision] = projectAsset.assetId.split('.');
                return revision ?
                    //by yj
                    `${PROJECT_SERVER}/Project/download?id=${projectId}&v=${revision}` :
                    `${PROJECT_SERVER}/Project/download?id=${projectId}`;
                    //`${PROJECT_SERVER}/internalapi/project/${projectId}/get/${revision}` :
                    //`${PROJECT_SERVER}/internalapi/project/${projectId}/get/`;
            }
        );
        this.addWebSource(
            [this.AssetType.ImageVector, this.AssetType.ImageBitmap, this.AssetType.Sound],
            //by yj
            asset => `${ASSET_SERVER}/Project/GetAsset?name=${asset.assetId}.${asset.dataFormat}`
        );
        this.addWebSource(
            [this.AssetType.Sound],
            asset => `static/extension-assets/scratch3_music/${asset.assetId}.${asset.dataFormat}`
        );
        defaultProjectAssets.forEach(asset => this.cache(
            this.AssetType[asset.assetType],
            this.DataFormat[asset.dataFormat],
            asset.data,
            asset.id
        ));
    }
}

const storage = new Storage();

export default storage;
