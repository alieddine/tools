 
import vkbeautify from 'vkbeautify';

const UniversalFormatter = ({ code, type }: { code: string; type: 'json' | 'xml' }) => {
  const format = () => {
    try {
      if (type === 'json') {
        const parsed = JSON.parse(code);
        return vkbeautify.json(JSON.stringify(parsed));
      } else {
        return vkbeautify.xml(code);
      }
    } catch (error) {
      console.error(`Invalid ${type}`, error);
      return code;
    }
  };

  return <pre>{format()}</pre>;
};
export default UniversalFormatter;