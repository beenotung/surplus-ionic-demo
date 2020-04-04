import * as Surplus from 'surplus';Surplus;
import {mapSample} from 's-array';
import SArray from 's-array';
import * as cx from 'classnames';
import data from 'surplus-mixin-data';
import onkey from 'surplus-mixin-onkey';
import focus from 'surplus-mixin-focus';

import {AppCtrl} from './controllers';
import {Author, PostType} from "./domain/types";

import {allNames} from '@beenotung/tslib/constant/character-name';
import {lowerCaseLetters, Random} from '@beenotung/tslib/random';
import {DAY} from '@beenotung/tslib/time';
import {assets} from "./global/assets";
import {routes} from "./router";
import {JsonView} from "./lib/json-view";
import {formatDateTime, isFullDateTime} from "./helpers/format";
import {i18n} from "./global/i18n";
import {VoteButtons} from "./helpers/vote-button";
import {ReportIcon} from "./helpers/report-icon";
import {ShareIcon} from "./helpers/share-icon";
import {sharePost} from "./helpers/app-share";

function isLongDateTimeFormat(post: PostType, now: number) {
	return (
		post.last_time &&
		isFullDateTime(post.last_time, now) &&
		isFullDateTime(post.timestamp, now)
	);
}

function genPosts(): PostType[] {
	let posts: PostType[] = [];
	for (let i = 0; i < 50; i++) {
		const id = i + 1;
		const create_time = Date.now() - Math.random() * 28 * DAY;
		const timestamp = create_time + Math.random() * 3 * DAY;
		let last_time;
		if (Random.nextBool()) {
			last_time = timestamp + Math.random() * 2 * DAY;
		}
		let author: Author | undefined;
		if (Random.nextBool()) {
			let nickname: string | undefined;
			if (Random.nextBool()) {
				nickname = Random.element(allNames);
			}
			author = {
				user_id: 'user-' + Random.nextInt(42),
				nickname,
				avatar: assets.user_icon,
			};
		}
		const tags: string[] = [];
		while (Random.nextBool(0.6)) {
			tags.push(Random.nextString(Random.nextInt(7, 3), lowerCaseLetters));
		}
		const post: PostType = {
			post_id: 'post-' + id,
			title: 'title ' + id,
			timestamp,
			create_time,
			last_time,
			comments: Random.nextInt(42),
			has_my_comment: Random.nextBool() || undefined,
			own: Random.nextBool() || undefined,
			author,
			tags,
			up_vote: Random.nextInt(42),
			down_vote: Random.nextInt(42 / 3),
			my_vote: Random.element(['up', 'down', undefined]),
		};
		posts.push(post);
	}
	return posts
}

const posts = SArray([] as PostType[])

function refresh() {
	setTimeout(() => {
		posts(genPosts())
	}, 42)
}

function renderPostRaw(post: PostType) {
	post = {...post, author: undefined};
	return <a href={'#' + routes.post_detail(post)}>
		{JsonView({data: post})}
	</a>
}

function renderPostHtml(post: PostType,now:number) {
	return (
		<div
			class="card post ion-margin-half ion-padding-half-2"
			onClick={e => console.log(e)}
		>
			<div class="tags">
				{post.tags.map(tag => (
					<span>{tag}</span>
				))}
			</div>
			<h2 class="title">{post.title}</h2>
			<div class="time ion-text-end">
				Po: {formatDateTime(post.timestamp)}
			</div>
			{post.author ? (
				<div>
					<ion-avatar>
						<img src={assets.user_icon} />
					</ion-avatar>
					<span>{post.author?.nickname || i18n.default_user_name}</span>
				</div>
			) : (
				[]
			)}
			<div class="controls">
				<ion-buttons>
					<VoteButtons
						votes={post}
						vote={vote => this.votePost({ vote, post_id: post.post_id })}
						unVote={() => this.unVotePost(post)}
						reversed={false}
					/>
					<ion-button color={post.has_my_comment ? 'primary' : 'medium'}>
						{post.comments}
						<ion-icon name="chatbubbles" />
					</ion-button>
				</ion-buttons>
				<ion-buttons class="right">
					<ReportIcon />
					<ShareIcon onClick={() => sharePost(post)} />
				</ion-buttons>
			</div>
			<div
				class={'footer ' + (isLongDateTimeFormat(post, now) ? 'long' : '')}
			>
				{post.last_time ? (
					<span class="time">CM: {formatDateTime(post.last_time)}</span>
				) : (
					<span />
				)}
				{/*<span class='time right'>Po: {formatDateTime(post.timestamp)}</span>*/}
			</div>
		</div>
	);
}

function renderPostIonic(post: PostType) {
	const icon = assets.user_icon;
	return (
		<ion-card href={'#' + routes.post_detail(post)}>
			<ion-card-header class="ion-no-padding">
				<ion-row>
					<ion-col size="auto">
						{post.tags.map(tag => (
							<ion-chip
								onClick={e => {
									e.preventDefault();
									this.search(tag);
								}}
							>
								{tag}
							</ion-chip>
						))}
					</ion-col>
					<ion-col />
					<ion-col size="auto">
						<ion-text class="timestamp">
							Po: {formatDateTime(post.create_time)}
						</ion-text>
					</ion-col>
				</ion-row>
			</ion-card-header>
			<ion-card-content class="ion-no-padding">
				<ion-row>
					<ion-col size="auto">
						<h2>{post.title}</h2>
					</ion-col>
					<ion-col />
					<ion-col size="auto">
						<ion-buttons>
							<ReportIcon />
							<ShareIcon onClick={() => sharePost(post)} />
						</ion-buttons>
					</ion-col>
				</ion-row>
				{post.author ? (
					<ion-item>
						<ion-avatar slot="start">
							<img src={icon} alt={i18n.profile['User Avatar']} />
						</ion-avatar>
						<ion-text>
							{post.author?.nickname || i18n.default_user_name}
						</ion-text>
					</ion-item>
				) : (
					undefined
				)}
			</ion-card-content>
			<ion-card-footer>
				<ion-row>
					<ion-col size="auto">
						{post.last_time ? (
							<ion-text class="timestamp">
								CM: {formatDateTime(post.last_time)}
							</ion-text>
						) : (
							[]
						)}
					</ion-col>
					<ion-col />
					<ion-col size="auto">
						<ion-buttons>
							<ion-button color={post.has_my_comment ? 'primary' : 'medium'}>
								{post.comments}
								<ion-icon name="chatbubbles" />
							</ion-button>
							<VoteButtons
								votes={post}
								vote={vote => this.votePost({ vote, post_id: post.post_id })}
								unVote={() => this.unVotePost(post)}
								reversed={true}
							/>
						</ion-buttons>
					</ion-col>
				</ion-row>
			</ion-card-footer>
		</ion-card>
	);
}

export const AppView = (ctrl: AppCtrl) => {
	const now=Date.now()
	return <ion-app>
		<ion-header>
			<ion-toolbar color="primary">
				<ion-title>
					ionic surplus demo
				</ion-title>
				<ion-buttons slot='end'>
					<ion-button onClick={refresh}>
						<ion-icon name='refresh'></ion-icon>
					</ion-button>
				</ion-buttons>
			</ion-toolbar>
		</ion-header>
		<ion-content className="ion-padding">
			<ion-segment>
				<ion-segment-button>
					JsonView
				</ion-segment-button>
				<ion-segment-button>
					html/css
				</ion-segment-button>
				<ion-segment-button>
					Ionic
				</ion-segment-button>
			</ion-segment>
			<ion-row>
				<ion-col>{mapSample(posts, renderPostRaw)}</ion-col>
				<ion-col>{mapSample(posts, post => renderPostHtml(post, now))}</ion-col>
				<ion-col>{mapSample(posts, renderPostIonic)}</ion-col>
			</ion-row>
		</ion-content>
	</ion-app>;
}

