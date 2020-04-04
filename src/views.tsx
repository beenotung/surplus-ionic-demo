import * as Surplus from 'surplus'; Surplus;
import { mapSample } from 's-array';
import * as cx from 'classnames';
import data from 'surplus-mixin-data';
import onkey from 'surplus-mixin-onkey';
import focus from 'surplus-mixin-focus';

import { AppCtrl } from './controllers';

export const AppView = (ctrl : AppCtrl) =>
	<ion-app>
		<ion-header>
			<ion-toolbar color="primary">
				<ion-title>
					Surplus Ionic Demo
				</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content className="ion-padding">
			<p hidden={!ctrl.isEmpty}>
				No messages yet
			</p>
			<ion-list>
				{mapSample(ctrl.all, message => <ion-item>
					<ion-grid>
						<ion-row>
							<ion-col>
								<ion-text>
									{message.text()}
								</ion-text>
							</ion-col>
						</ion-row>
						<ion-row>
							<ion-col>
								<ion-note>
									{message.timestamp()}
								</ion-note>
							</ion-col>
						</ion-row>
					</ion-grid>
					<ion-buttons slot='end'>
						<ion-button onClick={message.remove} color='danger'>
							<ion-icon name='trash'></ion-icon>
						</ion-button>
					</ion-buttons>
				</ion-item>)}
			</ion-list>
		</ion-content>
		<ion-footer>
			<ion-item>
				<input
					placeholder="send message"
					autoFocus={true}
					fn={data(ctrl.newMessage)}
					onKeyDown={ctrl.handleKeyDown}
				></input>
				<ion-buttons slot="end">
					<ion-button onClick={ctrl.create}>
						<ion-icon name="send"></ion-icon>
					</ion-button>
				</ion-buttons>
			</ion-item>
		</ion-footer>
	</ion-app>
