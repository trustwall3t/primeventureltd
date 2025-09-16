import React from 'react';

const ChatwootWidget = () => {
	const scriptContent = `
    var _smartsupp = _smartsupp || {};
    _smartsupp.key = '3b8c86bbc3bca0215cd8854da7c46b7adbc40ba4';
    window.smartsupp||(function(d) {
      var s,c,o=smartsupp=function(){ o._.push(arguments)};o._=[];
      s=d.getElementsByTagName('script')[0];c=d.createElement('script');
      c.type='text/javascript';c.charset='utf-8';c.async=true;
      c.src='https://www.smartsuppchat.com/loader.js?';s.parentNode.insertBefore(c,s);
    })(document);
  `;

	return (
		<>
			<script
				type='text/javascript'
				dangerouslySetInnerHTML={{ __html: scriptContent }}
			/>
			<noscript>
				{' '}
				Powered by{' '}
				<a
					href='https://www.smartsupp.com'
					target='_blank'
				>
					Smartsupp
				</a>
			</noscript>
		</>
	);
};

export default ChatwootWidget;
