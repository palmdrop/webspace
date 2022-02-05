import useSWR from 'swr';

const TestPage = () => {
  const { data, error } = useSWR( '/api/email' );

  console.log( data );
  console.log( error );

  return (
    <div>
      Test page

      { data }
      { error }

    </div>
  );
};

export default TestPage;