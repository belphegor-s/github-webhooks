import { ChangeEvent, FormEvent, useState } from 'react';
import './App.scss'
import eventsList from './data/eventsList';
import { BACKEND_URL } from './util/env';
import toast, { Toaster } from 'react-hot-toast';

interface obj {
	key: string;
	title: string;
	checked: boolean;
}

const App = () => {
	const [webhookURL, setWebhookURL] = useState('');
	const [secret, setSecret] = useState('');
	const [eventTypes, setEventTypes] = useState<string[]>(eventsList.filter((el) => el.checked).map((el) => el.key));

	const webhookRegisterHandler = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const data = {
			payloadURL: webhookURL,
			secret,
			eventTypes
		}
		try {
			const response = await fetch(`${BACKEND_URL}/api/webhooks`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			})

			const resData = await response.json();

			if(response.status === 201) {
				toast.success(resData.msg);
			} else {
				toast.error(resData.msg);
			}
        } catch(e) {
			console.log(e);
		}
        
	}

	const handleEventEmulate = async (key: string) => {
		try {
			const response = await fetch(`${BACKEND_URL}/api/event-emulate`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ type: key, data: {eventType: key, initiator: 'ayush'} })
			})

			const resData = await response.json();

			if(response.status === 200) {
				toast.success(resData.msg);
			} else {
				toast.error(resData.msg);
			}
		} catch(e) {
			console.log(e);
		}
	}

	return (
		<>
			<div className='container-limited'>
				<h1>Github Webhooks</h1>
				<strong>Register a Webhook:</strong>
				<br/>
				<br/>
				<form onSubmit={webhookRegisterHandler}>
					<div className='inputs'>
						<label htmlFor="webhook-url">
							Webhook URL
							<input type="text" id='webhook-url' onChange={(e) => setWebhookURL(e.target.value)}/>
						</label>
						<label htmlFor="secret">
							Secret
							<input type="text" id='secret' onChange={(e) => setSecret(e.target.value)}/>
						</label>
					</div>
					<p>Trigger webhook on events:</p>
					<div className='checkboxes'>
						{eventsList.map((eventType: obj, i: number) => {
							return (
								<label htmlFor={eventType.key} key={`event-${i}`}>
									<input type="checkbox" id={eventType.key} defaultChecked={eventType.checked} onChange={(e: ChangeEvent<HTMLInputElement>) => {
										const value: string = e.target.id;
										if(eventTypes.indexOf(value) !== -1) {
											setEventTypes(prev => prev.filter((el => el !== value)));
										} else {
											setEventTypes(prev => [...prev, value])
										}
									}}/>
									{eventType.title}
								</label>
							)
						})}
					</div>
					<button className='register-btn' type='submit'>Register Webhook</button>
				</form>
				<pre>Emulate Events</pre>
				<div className='event-emulate-btn__wrap'>
					{eventsList.map((eventType: obj, i: number) => {
						return (
							<button key={`event-emulate-btn-${i}`} onClick={() => handleEventEmulate(eventType.key)}>{eventType.title}</button>
						)
					})}
				</div>
			</div>
			<Toaster/>
		</>
	)
}

export default App
