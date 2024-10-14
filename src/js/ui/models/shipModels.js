const importAll = (requireContext) =>
  requireContext.keys().reduce((icons, key) => {
    const formattedKey = key
      .replace("./", "")
      .replace(".svg", "")
      .replace(/-/g, "-");

    return {
      ...icons,
      [formattedKey]: requireContext(key).default,
    };
  }, {});

const ICONS = importAll(
  require.context("../../../assets/images/ships", false, /\.svg$/)
);

const getModel = (key) => ICONS[key];
const getModels = () => ICONS;

export default { getModel, getModels };
