import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState } from 'react';

type Post = {
  id: string;
  user: {
    name: string;
    image: string;
    role: string;
  };
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: string;
  tags: string[];
  isFeatured?: boolean;
  category?: 'general' | 'policy' | 'expert-qa' | 'success-story';
};

type Event = {
  id: string;
  title: string;
  date: string;
  location: string;
  attendees: number;
  maxCapacity: number;
  status: 'Open' | 'Full' | 'Ongoing';
  image?: string;
  type: 'workshop' | 'webinar' | 'training';
  organizer?: string;
  price?: string;
};

type Forum = {
  id: string;
  name: string;
  description: string;
  members: number;
  topics: number;
  lastActive: string;
  category: 'crop' | 'livestock' | 'policy' | 'technology' | 'market';
  image?: string;
};

type GovernmentProgram = {
  id: string;
  title: string;
  organization: string;
  type: 'grant' | 'subsidy' | 'training';
  deadline: string;
  status: 'Open' | 'Closing Soon' | 'Closed';
  description: string;
  eligibility: string[];
  image?: string;
};

const SAMPLE_POSTS: Post[] = [
  {
    id: '1',
    user: {
      name: 'Dr. Sarah Moyo',
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=300',
      role: 'Agricultural Expert',
    },
    content: 'Important update on fall armyworm control: Early detection is crucial. Look for small holes in leaves and fresh frass. Apply appropriate pesticides in the early morning or late afternoon for best results.',
    image: 'https://images.unsplash.com/photo-1599493006232-b7e6c446b923?q=80&w=600',
    likes: 45,
    comments: 12,
    timestamp: '2h ago',
    tags: ['Pest Control', 'Tips', 'Education'],
    isFeatured: true,
  },
  {
    id: '2',
    user: {
      name: 'John Ndlovu',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300',
      role: 'Farmer',
    },
    content: 'Has anyone tried intercropping maize with cowpeas this season? Looking for advice on spacing and pest management.',
    likes: 23,
    comments: 8,
    timestamp: '4h ago',
    tags: ['Intercropping', 'Question', 'Maize'],
  },
];

const FORUMS: Forum[] = [
  {
    id: '1',
    name: 'Crop Farmers Network',
    description: 'Discussion group for crop farming techniques, pest control, and soil management',
    members: 1250,
    topics: 324,
    lastActive: '5m ago',
    category: 'crop',
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=300',
  },
  {
    id: '2',
    name: 'Agricultural Policy Hub',
    description: 'Updates and discussions on government policies affecting farmers',
    members: 856,
    topics: 156,
    lastActive: '2h ago',
    category: 'policy',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=300',
  },
];

const GOVERNMENT_PROGRAMS: GovernmentProgram[] = [
  {
    id: '1',
    title: 'Sustainable Farming Grant 2024',
    organization: 'Ministry of Agriculture',
    type: 'grant',
    deadline: 'Apr 30, 2024',
    status: 'Open',
    description: 'Financial support for farmers adopting sustainable farming practices',
    eligibility: ['Small-scale farmers', 'Minimum 2 years experience', 'Valid farming permit'],
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=300',
  },
  {
    id: '2',
    title: 'Agricultural Input Subsidy',
    organization: 'Rural Development Agency',
    type: 'subsidy',
    deadline: 'Mar 31, 2024',
    status: 'Closing Soon',
    description: 'Subsidies for seeds, fertilizers, and farming equipment',
    eligibility: ['Registered farmers', 'Less than 5 hectares land'],
    image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=300',
  },
];

const UPCOMING_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Modern Irrigation Workshop',
    date: 'Mar 15, 2024',
    location: 'Harare Agricultural Center',
    attendees: 45,
    maxCapacity: 50,
    status: 'Open',
    type: 'workshop',
    image: 'https://images.unsplash.com/photo-1563906267088-b029e7101114?q=80&w=300',
    organizer: 'Agricultural Extension Services',
  },
  {
    id: '2',
    title: 'Digital Farming Webinar',
    date: 'Mar 18, 2024',
    location: 'Online',
    attendees: 120,
    maxCapacity: 200,
    status: 'Open',
    type: 'webinar',
    image: 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?q=80&w=300',
    organizer: 'AgriTech Institute',
    price: 'Free',
  },
];

const FILTER_OPTIONS = ['All', 'Questions', 'Tips', 'News', 'Success Stories', 'Policy Updates', 'Expert Q&A'];

export default function CommunityScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [activeTab, setActiveTab] = useState('feed');

  const renderForums = () => (
    <View style={styles.forumsSection}>
      <Text style={styles.sectionTitle}>Popular Forums</Text>
      {FORUMS.map((forum) => (
        <Pressable key={forum.id} style={styles.forumCard}>
          <Image
            source={{ uri: forum.image }}
            style={styles.forumImage}
            contentFit="cover"
          />
          <View style={styles.forumContent}>
            <Text style={styles.forumName}>{forum.name}</Text>
            <Text style={styles.forumDescription}>{forum.description}</Text>
            <View style={styles.forumStats}>
              <Text style={styles.forumStatText}>
                <Ionicons name="people" size={14} color="#666" /> {forum.members} members
              </Text>
              <Text style={styles.forumStatText}>
                <Ionicons name="chatbubbles" size={14} color="#666" /> {forum.topics} topics
              </Text>
              <Text style={styles.forumStatText}>
                <Ionicons name="time" size={14} color="#666" /> {forum.lastActive}
              </Text>
            </View>
          </View>
        </Pressable>
      ))}
    </View>
  );

  const renderGovernmentPrograms = () => (
    <View style={styles.programsSection}>
      <Text style={styles.sectionTitle}>Government & NGO Programs</Text>
      {GOVERNMENT_PROGRAMS.map((program) => (
        <Pressable key={program.id} style={styles.programCard}>
          <Image
            source={{ uri: program.image }}
            style={styles.programImage}
            contentFit="cover"
          />
          <View style={styles.programContent}>
            <View style={styles.programHeader}>
              <Text style={styles.programTitle}>{program.title}</Text>
              <View style={[
                styles.programStatus,
                { backgroundColor: program.status === 'Closing Soon' ? '#FEF3C7' : '#DCFCE7' }
              ]}>
                <Text style={[
                  styles.programStatusText,
                  { color: program.status === 'Closing Soon' ? '#92400E' : '#166534' }
                ]}>{program.status}</Text>
              </View>
            </View>
            <Text style={styles.programOrg}>{program.organization}</Text>
            <Text style={styles.programDescription}>{program.description}</Text>
            <View style={styles.programDeadline}>
              <Ionicons name="calendar" size={14} color="#666" />
              <Text style={styles.programDeadlineText}>Deadline: {program.deadline}</Text>
            </View>
            <View style={styles.eligibilityContainer}>
              <Text style={styles.eligibilityTitle}>Eligibility:</Text>
              {program.eligibility.map((criteria, index) => (
                <View key={index} style={styles.eligibilityItem}>
                  <Ionicons name="checkmark-circle" size={14} color="#2D6A4F" />
                  <Text style={styles.eligibilityText}>{criteria}</Text>
                </View>
              ))}
            </View>
            <Pressable style={styles.applyButton}>
              <Text style={styles.applyButtonText}>Apply Now</Text>
            </Pressable>
          </View>
        </Pressable>
      ))}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Community</Text>
        <Pressable style={styles.notificationButton}>
          <Ionicons name="notifications" size={24} color="#2D6A4F" />
        </Pressable>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search posts, events, and programs..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tab, activeTab === 'feed' && styles.activeTab]}
          onPress={() => setActiveTab('feed')}
        >
          <Text style={[styles.tabText, activeTab === 'feed' && styles.activeTabText]}>Feed</Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'forums' && styles.activeTab]}
          onPress={() => setActiveTab('forums')}
        >
          <Text style={[styles.tabText, activeTab === 'forums' && styles.activeTabText]}>Forums</Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'programs' && styles.activeTab]}
          onPress={() => setActiveTab('programs')}
        >
          <Text style={[styles.tabText, activeTab === 'programs' && styles.activeTabText]}>Programs</Text>
        </Pressable>
      </View>

      {activeTab === 'feed' && (
        <>
      <View style={styles.eventsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          <Pressable>
            <Text style={styles.seeAllButton}>See All</Text>
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {UPCOMING_EVENTS.map((event) => (
            <View key={event.id} style={styles.eventCard}>
              <Image
                source={{ uri: event.image }}
                style={styles.eventImage}
                contentFit="cover"
              />
              <Text style={styles.eventTitle}>{event.title}</Text>
              <View style={styles.eventDetails}>
                <Text style={styles.eventDate}>
                  <Ionicons name="calendar" size={14} color="#666" /> {event.date}
                </Text>
                <Text style={styles.eventLocation}>
                  <Ionicons name="location" size={14} color="#666" /> {event.location}
                </Text>
                <View style={styles.attendeeInfo}>
                  <Ionicons name="people" size={14} color="#666" />
                  <Text style={styles.attendeeText}>
                    {event.attendees}/{event.maxCapacity} attending
                  </Text>
                </View>
              </View>
              <View style={[styles.eventStatus, { backgroundColor: event.status === 'Full' ? '#FEE2E2' : '#DCFCE7' }]}>
                <Text style={[styles.eventStatusText, { color: event.status === 'Full' ? '#DC2626' : '#166534' }]}>
                  {event.status}
                </Text>
              </View>
              <Pressable style={[styles.registerButton, event.status === 'Full' && styles.disabledButton]} disabled={event.status === 'Full'}>
                <Text style={styles.registerButtonText}>{event.status === 'Full' ? 'Waitlist' : 'Register'}</Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>
      </View>
      <View style={styles.createPostSection}>
        <View style={styles.createPost}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300' }}
            style={styles.userAvatar}
            contentFit="cover"
          />
          <Pressable 
            style={styles.postInput}
            onPress={() => setShowCreatePost(true)}
          >
            <Text style={styles.postInputPlaceholder}>Share your farming experience...</Text>
          </Pressable>
          <Pressable style={styles.createPostButton}>
            <Ionicons name="add-circle" size={24} color="#2D6A4F" />
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
          {FILTER_OPTIONS.map((filter) => (
            <Pressable
              key={filter}
              style={[styles.filterChip, selectedFilter === filter && styles.filterChipSelected]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text style={[styles.filterChipText, selectedFilter === filter && styles.filterChipTextSelected]}>
                {filter}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
      <View style={styles.feed}>
        {SAMPLE_POSTS.filter(post => post.isFeatured).map((post) => (
          <View key={post.id} style={[styles.postCard, styles.featuredPost]}>
            <View style={styles.featuredBadge}>
              <Ionicons name="star" size={16} color="#FFB800" />
              <Text style={styles.featuredText}>Featured</Text>
            </View>
            <View style={styles.postHeader}>
              <Image
                source={{ uri: post.user.image }}
                style={styles.authorImage}
                contentFit="cover"
              />
              <View style={styles.authorInfo}>
                <Text style={styles.authorName}>{post.user.name}</Text>
                <Text style={styles.authorRole}>{post.user.role}</Text>
              </View>
              <Text style={styles.timestamp}>{post.timestamp}</Text>
            </View>
            <Text style={styles.postContent}>{post.content}</Text>
            <View style={styles.tagContainer}>
              {post.tags.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
            {post.image && (
              <Image
                source={{ uri: post.image }}
                style={styles.postImage}
                contentFit="cover"
              />
            )}
            <View style={styles.postActions}>
              <Pressable style={styles.actionButton}>
                <Ionicons name="heart-outline" size={24} color="#666" />
                <Text style={styles.actionText}>{post.likes}</Text>
              </Pressable>
              <Pressable style={styles.actionButton}>
                <Ionicons name="chatbubble-outline" size={24} color="#666" />
                <Text style={styles.actionText}>{post.comments}</Text>
              </Pressable>
              <Pressable style={styles.actionButton}>
                <Ionicons name="share-social-outline" size={24} color="#666" />
              </Pressable>
              <Pressable style={styles.actionButton}>
                <Ionicons name="bookmark-outline" size={24} color="#666" />
              </Pressable>
            </View>
          </View>
        ))}
        {SAMPLE_POSTS.filter(post => !post.isFeatured).map((post) => (
          <View key={post.id} style={styles.postCard}>
            <View style={styles.postHeader}>
              <Image
                source={{ uri: post.user.image }}
                style={styles.authorImage}
                contentFit="cover"
              />
              <View style={styles.authorInfo}>
                <Text style={styles.authorName}>{post.user.name}</Text>
                <Text style={styles.authorRole}>{post.user.role}</Text>
              </View>
              <Text style={styles.timestamp}>{post.timestamp}</Text>
            </View>
            <Text style={styles.postContent}>{post.content}</Text>
            <View style={styles.tagContainer}>
              {post.tags.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
            {post.image && (
              <Image
                source={{ uri: post.image }}
                style={styles.postImage}
                contentFit="cover"
              />
            )}
            <View style={styles.postActions}>
              <Pressable style={styles.actionButton}>
                <Ionicons name="heart-outline" size={24} color="#666" />
                <Text style={styles.actionText}>{post.likes}</Text>
              </Pressable>
              <Pressable style={styles.actionButton}>
                <Ionicons name="chatbubble-outline" size={24} color="#666" />
                <Text style={styles.actionText}>{post.comments}</Text>
              </Pressable>
              <Pressable style={styles.actionButton}>
                <Ionicons name="share-social-outline" size={24} color="#666" />
              </Pressable>
              <Pressable style={styles.actionButton}>
                <Ionicons name="bookmark-outline" size={24} color="#666" />
              </Pressable>
            </View>
          </View>
        ))}
      </View>
        </>
      )}

      {activeTab === 'forums' && renderForums()}
      {activeTab === 'programs' && renderGovernmentPrograms()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
  },
  notificationButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    margin: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#1F2937',
  },
  eventsSection: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  seeAllButton: {
    color: '#2D6A4F',
    fontSize: 14,
    fontWeight: '600',
  },
  eventCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 280,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  eventImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 12,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  eventDetails: {
    marginBottom: 12,
  },
  eventDate: {
    color: '#666',
    marginBottom: 4,
  },
  eventLocation: {
    color: '#666',
  },
  attendeeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  attendeeText: {
    marginLeft: 4,
    color: '#666',
    fontSize: 14,
  },
  eventStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  eventStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  registerButton: {
    backgroundColor: '#2D6A4F',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  createPostSection: {
    backgroundColor: '#FFF',
    padding: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
  },
  createPost: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFF',
    marginBottom: 8,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  postInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 16,
  },
  postInputPlaceholder: {
    color: '#9CA3AF',
  },
  createPostButton: {
    padding: 8,
  },
  filterContainer: {
    marginTop: 12,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    marginRight: 8,
  },
  filterChipSelected: {
    backgroundColor: '#2D6A4F',
  },
  filterChipText: {
    color: '#4B5563',
    fontSize: 14,
    fontWeight: '500',
  },
  filterChipTextSelected: {
    color: '#FFF',
  },
  featuredPost: {
    borderWidth: 2,
    borderColor: '#FFB800',
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    margin: 16,
  },
  featuredText: {
    color: '#FFB800',
    fontWeight: '600',
    marginLeft: 4,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#4B5563',
    fontSize: 12,
    fontWeight: '500',
  },
  feed: {
    padding: 16,
  },
  postCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  authorImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
  },
  authorRole: {
    color: '#666',
    fontSize: 14,
  },
  timestamp: {
    color: '#666',
    fontSize: 14,
  },
  postContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    lineHeight: 20,
  },
  postImage: {
    width: '100%',
    height: 200,
  },
  postActions: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionText: {
    marginLeft: 4,
    color: '#666',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#2D6A4F',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  activeTabText: {
    color: '#FFF',
  },
  forumsSection: {
    padding: 16,
  },
  forumCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  forumImage: {
    width: '100%',
    height: 120,
  },
  forumContent: {
    padding: 16,
  },
  forumName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  forumDescription: {
    color: '#4B5563',
    marginBottom: 12,
  },
  forumStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  forumStatText: {
    color: '#666',
    fontSize: 14,
  },
  programsSection: {
    padding: 16,
  },
  programCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  programImage: {
    width: '100%',
    height: 160,
  },
  programContent: {
    padding: 16,
  },
  programHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  programTitle: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
  },
  programStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  programStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  programOrg: {
    color: '#666',
    fontSize: 14,
    marginBottom: 8,
  },
  programDescription: {
    color: '#4B5563',
    marginBottom: 12,
  },
  programDeadline: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  programDeadlineText: {
    color: '#666',
    marginLeft: 4,
  },
  eligibilityContainer: {
    marginBottom: 16,
  },
  eligibilityTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  eligibilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  eligibilityText: {
    marginLeft: 8,
    color: '#4B5563',
  },
  applyButton: {
    backgroundColor: '#2D6A4F',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
});