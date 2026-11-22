import { OnboardingSlide, Cafe } from '../types';

export const SIP_PASS_LOGO =
  'https://lh3.googleusercontent.com/aida/ALJJyrAG_t9gI7qi500Z_n6gv_faNM0ah5OuXFvW2HCteh5VSKCz-Jc7kc5Rn6_T6JozTovZdZ9kuXr98iL-TEKGj8svc7bwIamx6y82mttr86j5dd_qYxuoVW-Z_07UnCJl_zZe7a6c7JF2Iqb97Fq5mOyy93n9ZUajz4jHYWHLQp7YAqBbdS63X_5RAw6vJMovdvwPUE5ivHAzALA3mRl1N1WrdjtQ23oeil-cXTO_kH8o2oYtspZIERkSDw-7OZeRPsoO85DUYr0';

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    image:
      'https://lh3.googleusercontent.com/aida/ALJJyrD2UDxeTSWnVXk4F9Bye1gzBnQCp0DhogJ40G0ePq8Ek6GE2kZKiuHhtLqwunV_6HxrcvZcfE29q8El7AqRMnznnoXx02FvIf_Ji_wabyss8rHGUil4yP04WEmmrxjNN4PUviGhTlSdEcTNr5PeRvgt7KXK86knqs1SFQoxO9f2BSwOJgAUhVaEU-XZK5GmWcvhUnYThjBbb38P7g8unCLhKWz-qKlJzRi82anArAM9oxhi5No3xt9wkZ5kH8ggiuHwQJxGdP-cGao732cXyXzQAcZ1Vw4',
    badgeIcon: 'compass-outline',
    badgeText: '240+ Partner Cafes',
    title: 'Coffee Made Easy, Every Day',
    body: 'Discover 240+ indie cafes across Bengaluru, Mumbai, and Delhi NCR with one daily pass.',
  },
  {
    image:
      'https://lh3.googleusercontent.com/aida/ALJJyrDXU0YoWVIO1dITFu9hVJAY_zJn1H2ctaBNhQ4p0mHiup4zrgzX3yUo0l-M407GPmh0qu3wAQh0w7TswHGN-HlNPsTH0Q6z0u9NFYQZfWM-QfGyHdoB4xn5TXlL_ZGies_fLBdsJ4HY8La28Cv7pUOcjTTmIegFzFfBxplpFNYV8p57509bVW9Uwf_u-R0zmlDywmDWIz1kIlYC2NHGZRuRfc8UDi57fCah5aLKK6V-5H6Tr4WSe6oQJHyLg2Z51cP4dYo',
    badgeIcon: 'cafe-outline',
    badgeText: '1 Coffee Daily',
    title: 'One Fresh Cup, Every Morning',
    body: 'Pick your morning flat white or afternoon iced pour-over and redeem in seconds with a QR code.',
  },
  {
    image:
      'https://lh3.googleusercontent.com/aida/ALJJyrAiass8M5ETueNpM16yCK_6Kc3NHvtysC3wdna4b6qtPnStCmqZjoETYkJycdw0mOGYeGSSo6xkR0XOLuRJLgVhlI99AtKKxWpwu5c12kgJ5ygAWqRyVtqr7XZUeApRqWXXv5_9UGFEV25u4nhAmHuMlzckw3ueX3oH_y0CNgPVugBlOPrOUbwp1EuAhVX_BJVCnDQJpgxe7It9OTwQ1UkHbS27RKzMLoa5oiM6k3mNj42PJovEpj6gycOSe5zdYw',
    badgeIcon: 'wallet-outline',
    badgeText: 'Save up to ₹3,200/mo',
    title: 'Explore Without Overspending',
    body: 'Flat monthly pass built for students, freelancers, and cafe regulars across Indian metros.',
  },
];

export const MOCK_USER = {
  name: 'Aarav Mehta',
  location: 'Indiranagar, Bengaluru',
  avatar:
    'https://lh3.googleusercontent.com/aida/ALJJyrClNGm_ePwKj4ElYQRxTk8mrH0jkQiOmqUlblZC9aFrlDAgJB7ZVaZ8vGi52D9TGWGIRxsowHYLze0RxbcC9JArSrVOa5AbcuWzqfNkA1slutr6QvRKS0EifA41mTsbpUqG6pmBjOvp4sXaPxPKWcUH7U98VXhFWCAtR1seYyaqIREHpk_OI-cYUwslAwRTDqWud1PtU-wQx-GU2Cq3LI9vzgODEXxFfw9nzv2AnoYfBwwp8SM0KOaldeWWVSijbn-v',
};

export const MOCK_CAFES: Cafe[] = [
  {
    id: 'cafe-1',
    name: 'Third Wave Coffee',
    address: '100 Feet Rd, Indiranagar',
    distance: '350 m',
    rating: 4.8,
    image:
      'https://lh3.googleusercontent.com/aida/ALJJyrDXU0YoWVIO1dITFu9hVJAY_zJn1H2ctaBNhQ4p0mHiup4zrgzX3yUo0l-M407GPmh0qu3wAQh0w7TswHGN-HlNPsTH0Q6z0u9NFYQZfWM-QfGyHdoB4xn5TXlL_ZGies_fLBdsJ4HY8La28Cv7pUOcjTTmIegFzFfBxplpFNYV8p57509bVW9Uwf_u-R0zmlDywmDWIz1kIlYC2NHGZRuRfc8UDi57fCah5aLKK6V-5H6Tr4WSe6oQJHyLg2Z51cP4dYo',
    tags: ['all', 'specialty', 'work', 'top'],
    openStatus: 'Open',
  },
  {
    id: 'cafe-2',
    name: 'Blue Tokai Coffee',
    address: '12th Main, Indiranagar',
    distance: '650 m',
    rating: 4.9,
    image:
      'https://lh3.googleusercontent.com/aida/ALJJyrAzT5Y8-8ixb1_OJqXbl3Ky4ptEJ5c7yFZFd_zLNMqE-A3ZEeauHVdLMEJItTy36ja5uooRujhCJ7l1cAB6_3SrF0kYFvmlBGlueG8iNNoZPhSpC1DX2RO-3I0HpE_oVzDatECnI0ms8j7r6_WP7n_AMbhG0azG24m0yhoMpLFLNYxLit4XdVM_2eTRHW8uN-i3a0FCi_ZKoVYJMScViCRutMFo1SQtjexWhpNlo3M6ykFR1bgLhRnXjTzUZN_iWPOs8zU',
    tags: ['all', 'specialty', 'top'],
    openStatus: 'Open',
  },
  {
    id: 'cafe-3',
    name: 'Araku Coffee',
    address: '12th Main Rd, HAL 2nd Stage',
    distance: '1.2 km',
    rating: 4.8,
    image:
      'https://lh3.googleusercontent.com/aida/ALJJyrAiass8M5ETueNpM16yCK_6Kc3NHvtysC3wdna4b6qtPnStCmqZjoETYkJycdw0mOGYeGSSo6xkR0XOLuRJLgVhlI99AtKKxWpwu5c12kgJ5ygAWqRyVtqr7XZUeApRqWXXv5_9UGFEV25u4nhAmHuMlzckw3ueX3oH_y0CNgPVugBlOPrOUbwp1EuAhVX_BJVCnDQJpgxe7It9OTwQ1UkHbS27RKzMLoa5oiM6k3mNj42PJovEpj6gycOSe5zdYw',
    tags: ['all', 'work'],
    openStatus: 'Open',
  },
];
