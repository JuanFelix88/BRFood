import TerserPlugin from 'terser-webpack-plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * 
   * @param {} config 
   * @param {*} param1 
   * @returns 
   */
  webpack: (
    config
  ) => {
    // Configurado para adaptar a injeção de dependência
    config.optimization = {
      ...config.optimization,
        minimizer: [
          new TerserPlugin({
            terserOptions: {
              keep_classnames: true,
            },
          }),
        ],
    }
    // Important: return the modified config

    return config
  },
};

export default nextConfig;
