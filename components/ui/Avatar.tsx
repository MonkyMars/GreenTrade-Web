import * as React from 'react';
import Image from 'next/image';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/functions/cn';
import { User } from '@/lib/types/user';

const AvatarVariants = cva(
	'absolute inset-0 flex items-center w-full h-full justify-center bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 text-4xl font-bold ',
	{
		variants: {
			size: {
				default: 'h-10 w-10',
				sm: 'h-8 w-8',
				lg: 'h-12 w-12',
			},
			imageSize: {
				default: {
					width: 24,
					height: 24,
				},
				sm: {
					width: 20,
					height: 20,
				},
				lg: {
					width: 32,
					height: 32,
				},
			},
		},
	}
);

export interface AvatarProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof AvatarVariants> {
	user: User | null;
}

function Avatar({ className, user, ...props }: AvatarProps) {
	if (!user) {
		return (
			<div
				className={cn(AvatarVariants({ size: 'default' }), className)}
				{...props}
			>
				A
			</div>
		);
	}

	return (
		<div
			className={cn(
				AvatarVariants({ size: 'default' }),
				className,
				'h-full w-full'
			)}
			{...props}
		>
			{user.picture ? (
				<Image
					src={user.picture}
					alt={user.name}
					className='h-full w-full object-cover rounded-full'
					width={96}
					height={96}
					draggable={false}
					priority
				/>
			) : (
				<div>{user?.name?.charAt(0).toUpperCase()}</div>
			)}
		</div>
	);
}

export { Avatar, AvatarVariants };
