export default function (e) {
    e.configDefaultConfig.forEach(config => {
        config.external.push(/^dojo\//);
    });
    return e.configDefaultConfig;
}
