# myheadless-react

A React CMS client for fetching and managing CMS page data using a context API via myheadless.io.

## Installation

```bash
npm install myheadless-react
```
## Usage
```typescript
import { CMSProvider, useCMS, CMSConfiguration } from 'myheadless-react';

const config: CMSConfiguration = { baseURL: 'https://myheadless.io/cms', apiKey: 'your-api-key' };

function App() {
  return (
    <CMSProvider config={config}>
      <YourComponent />
    </CMSProvider>
  );
}

function YourComponent() {
  const { loadPageData, getTextContent, isLoading, error } = useCMS();
  React.useEffect(() => {
    loadPageData('page-id-123');

    return () => {
            cms.cleanUp();
        }
  }, []);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return <div>{getTextContent('text-block-id')}</div>;
}